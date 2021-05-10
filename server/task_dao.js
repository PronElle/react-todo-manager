'use strict'

const dayjs = require('dayjs');
const sqlite = require('sqlite3').verbose();

const DBNAME = './tasks.db'

// open the database
const db = new sqlite.Database(DBNAME, (err) => {
   if(err) throw err;
});

// create task

// get tasks

// get task by id

// delete task

// update task