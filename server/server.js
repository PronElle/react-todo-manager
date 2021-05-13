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
    dao.getTasks()
        .then((tasks) => {res.json(tasks); })
        .catch((err) => {res.status(500).json(err); });
});

// GET /tasks/:filter
app.get('/tasks/:filter', (req, res) => {
    const filter = req.params.filter;
    dao.getTasks(filter)
        .then((tasks) => {res.json(tasks); })
        .catch((err) => {res.status(503).json(err); });
});

// GET /tasks/:id
app.get('/tasks/:id', async (req, res) => {
    const id = req.params.id;
    try {
        let task = await dao.getTask(id);
        res.json(task);
    } catch (err) {
        res.status(503).json(err);
    }
});

// POST /tasks
app.get('/tasks', (req, res) => {
    // call createTask here 
});

// DELETE /taks/:id
app.get('/tasks', (req, res) => {
    // call deleteTask here 
});

// PUT /tasks/:id
app.put('/tasks/:id',
    [
        check("priv").isBoolean(),
        check("important").isBoolean(),
        check("completed").isBoolean(),
        check("description").isLength({ 'min': 1 }),
        check("deadline").isDate({ format: 'YYYY-MM-DD', strictMode: true })
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }

        const task = req.body;
        const id = req.params.id;

        dao.updateTask(id, task)
            .then(() => res.status(200).end())
            .catch((err) => res.status(503).json({
                errors: [{ 'param': 'Server', 'msg': err }]
            }));
    });


// activate server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));

