const express = require('express');
const morgan = require('morgan'); // logging middleware
const dao = require('./task_dao.js');
const {check, validationResult} = require('express-validator'); // validation middleware

// init express
const PORT = 3001;
const app = express();

app.use(morgan('dev'));
app.use(express.json());

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


// activate server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));

