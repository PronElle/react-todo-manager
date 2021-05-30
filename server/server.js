const express = require('express');
const morgan = require('morgan'); // logging middleware
const dao = require('./task_dao.js');
const {check, validationResult} = require('express-validator'); // validation middleware

 /* --- Authentication related imports ---- */
const passport = require('passport');
const passportLocal = require('passport-local');
const userDao = require('./user_dao');
const session = require('express-session'); // session middleware

// init express
const PORT = 3001;
const app = express();

app.use(morgan('dev'));
app.use(express.json());

 /* --- Basic Passport configuration ---- */
passport.use(new passportLocal.Strategy((username, password, done) => {
    // verification callback for authentication
    userDao.getUser(username, password).then(user => {
      if (user)
        done(null, user);
      else
        done(null, false, { message: 'Incorrent username or password' });
    }).catch(err => {
      done(err);
    });
}));
  

passport.serializeUser((user, done) => {
  done(null, user.id);
});
  
// starting from the data in the session, extract current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); 
    }).catch(err => {
      done(err, null);
    });
});


const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
      return next();
  
    return res.status(401).json({ error: 'not authenticated' });
}
  
  
  // initialize and configure HTTP sessions
  app.use(session({
    secret: 'this is my secret',
    resave: false,
    saveUninitialized: false
  }));
  
  // tell passport to use session cookies
  app.use(passport.initialize());
  app.use(passport.session());



/* ------ APIs ------ */

// GET /tasks
app.get('/tasks', isLoggedIn, (req, res) => {
    // getTask retrieves an empty task list in case of 
    // unknown filter
    dao.getTasks(req.query.filter, req.user.id)
        .then(tasks => res.json(tasks))
        .catch( err  => res.status(500).json(err));
});


// GET /tasks/:id
app.get('/tasks/:id', (req, res) => {
    dao.getTask(req.params.id)
    .then( task => {
        if(!task)
            res.status(404).send();
         else 
            res.json(task);
 
    }).catch(err => res.status(500).json(err));
});

// POST /tasks
app.post('/tasks', [
    check("priv").isBoolean(),
    check("important").isBoolean(),
    check("completed").isBoolean(),
    check("description").isLength({ 'min': 1 }),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    const task = req.body;
    task['user'] = req.user.id;
    dao.createTask(task)
       .then(() => res.status(250).end())
       .catch(error => res.status(550).json(error))
});

// DELETE /taks/:id
app.delete('/tasks/:id', (req, res) => {
    dao.deleteTask(req.params.id)
    .then(()=>res.status(250).end())
    .catch(error => res.status(550).json(error))
});

// PUT /tasks/:id
app.put('/tasks/:id', [
        check("priv").isBoolean(),
        check("important").isBoolean(),
        check("completed").isBoolean(),
        check("description").isLength({ 'min': 1 }),
    ],
     (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        if(!req.body.id)
            res.status(400).end();
        else {
            const task = req.body;
            task['user'] = req.user.id;
            const id = req.params.id;

            dao.updateTask(id, task)
                .then(() => res.status(200).end())
                .catch((err) => res.status(503).json({
                    errors: [{ 'param': 'Server', 'msg': err }]
                }));
        }
    });

/* --- Login APIs ---- */

// login
app.post('/sessions', function(req, res, next) {
    passport.authenticate('local', (err, user, info) => {
      if (err)
        return next(err);
        if (!user) {
          // display wrong login messages
          return res.status(401).json(info);
        }
        // success, perform the login
        req.login(user, (err) => {
          if (err)
            return next(err);
          
          // req.user contains the authenticated user, we send all the user info back
          // this is coming from userDao.getUser()
          return res.json(req.user);
        });
    })(req, res, next);
  });


// GET /sessions/current
app.get('/sessions/current', (req, res) => {
    if(req.isAuthenticated()) {
      res.status(200).json(req.user);}
    else
      res.status(401).json({error: 'Unauthenticated user!'});;
  });

  
// DELETE /sessions/current 
// logout
app.delete('/sessions/current', (req, res) => {
  req.logout();
  res.end();
});



// activate server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));

