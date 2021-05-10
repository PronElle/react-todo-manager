const express = require('express');
const morgan = require('morgan'); // logging middleware
const dao = require('./task_dao.js');

// init express
const PORT = 3001;
const app = express();

app.use(morgan('dev'));
app.use(express.json());

/* ------ APIs ------ */

// GET /tasks
app.get('/tasks', (req, res) => {
    // call getTasks here 
});

// GET /tasls/:id
app.get('/tasks/:id', (req, res) => {
    // call getTask here 
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
app.get('/tasks/:id', (req, res) => {
    // call updateTask here 
});

// activate server
app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));

