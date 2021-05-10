const express = require('express');
const morgan = require('morgan'); // logging middleware
const dao = require('./task_dao.js');

// init express
const PORT = 3001;
const app = express();

app.use(morgan('dev'));
app.use(express.json());

/* ------ APIs ------ */

// GET /todos

// GET /todos/:id

// POST /todos

// DELETE /todos/:id

// PUT /todos/:id

// activate server
app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}/`));

