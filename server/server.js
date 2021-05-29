const express = require('express');
const morgan = require('morgan'); // logging middleware
const dao = require('./task_dao.js');
const {check, validationResult} = require('express-validator'); // validation middleware

 /* --- Authentication related imports ---- */
const passport = require('passport');
const passportLocal = require('passport-local');
const userDao = require('./user-dao');
const session = require('express-session'); // session middleware

// init express
const PORT = 3001;
const app = express();

app.use(morgan('dev'));
app.use(express.json());

 /* --- Basic Passport configuration ---- */
// step 1 : initialize and configure passport
passport.use(new passportLocal.Strategy((username, password, done) => {
    // verification callback for authentication
    userDao.getUser(username, password).then(user => {
      if (user)
        done(null, user);
      else
        done(null, false, { message: 'Username or password wrong' });
    }).catch(err => {
      done(err);
    });
  }));
  
  // serialize and de-serialize the user (user object <-> session)
  // we serialize the user id and we store it in the session: the session is very small in this way
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  // starting from the data in the session, we extract the current (logged-in) user
  passport.deserializeUser((id, done) => {
    userDao.getUserById(id)
      .then(user => {
        done(null, user); // this will be available in req.user
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
app.get('/tasks', (req, res) => {
    // getTask retrieves an empty task list in case of 
    // unknown filter
    dao.getTasks(req.query.filter)
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

    dao.createTask(req.body)
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
app.post('/api/sessions', function(req, res, next) {
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
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
    if(req.isAuthenticated()) {
      res.status(200).json(req.user);}
    else
      res.status(401).json({error: 'Unauthenticated user!'});;
  });


/////////////////////////////////////////////////////////

// activate server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));

