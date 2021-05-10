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
exports.getAll = () => {
   return new Promise((resolve, reject) => {
     const sql = 'SELECT * FROM tasks' ;
     db.all(sql, [], (err, rows) => {
       if(err)
         reject(err);
       else {
         const tasks = rows.map((record) => ({id: record.id,description: record.description,important: record.important == 1,private: record.private == 1,deadline: record.deadline,completed: record.completed,user: record.user }));
         resolve(tasks);
       }
     });
   });
 };

// get task by id

// delete task

// update task
exports.updateTask = (task) => {
   return new Promise((resolve, reject) => {
     const sql = 'UPDATE tasks SET description=?,important=?,private=?,completed=?,user=? WHERE id = ?';
     db.run(sql, [ task.description,task.important,task.private,task.completed,task.user, task.id], function (err) {
       if (err) {
         reject(err);
         return;
       }
       resolve(this.lastID);
     });
   });
 };




////////////////////////////// Can be deleted if not important .

// get depending on deadline
 exports.getAfterDeadline = (deadline) => {
   return new Promise((resolve, reject) => {
     const sql = 'SELECT * FROM tasks WHERE deadline > ?';
     db.all(sql, [deadline.format()], (err, rows) => {
       if(err)
         reject(err);
       else {
         const tasks = rows.map((record) => (record) => ({id: record.id,description: record.description,important: record.important == 1,priv: record.private == 1,deadline: record.deadline }));
         resolve(tasks);
       }
     });
   });
 };



 // get depending on description
 exports.getWithWord = (word) => {
   return new Promise((resolve, reject) => {
     const sql = "SELECT * FROM tasks WHERE description LIKE ?";
     db.all(sql, ["%" + word + "%"], (err, rows) => {
       if(err)
         reject(err);
       else {
         const tasks = rows.map((record) => ({id: record.id,description: record.description,important: record.important == 1,priv: record.private == 1,deadline: record.deadline }));
         resolve(tasks);
       }
     });
   });
 };
