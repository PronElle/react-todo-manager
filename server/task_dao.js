'use strict'

const sqlite = require('sqlite3').verbose();
const Task = require('./task');

const DBNAME = './tasks.db'

// open the database
const db = new sqlite.Database(DBNAME, (err) => {
   if(err) throw err;
});



const createTaskObject = (row) => {
  return new Task(row.id, row.description, row.important === 1, row.private === 1, row.deadline,row.completed === 1, row.user);
}

// create task
exports.createTask = (task) => {
  return new Promise((resolve, reject) => {
      const query = 'INSERT INTO tasks(description, important, private, deadline, completed, user) VALUES(?,?,?, DATETIME(?),?,?)';
      db.run(query, [task.description, task.important, task.priv, task.deadline, task.completed, task.user],  function (err) {
          if(err)
              reject(err);
          else
              resolve(this.lastID);
      });
  })
}

// get tasks (optionally filtered)
exports.getTasks = (filter) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM tasks';
    db.all(query, [], (err, rows) => {
      if(err)
        reject(err);
      else{
        let tasks = rows.map( row => createTaskObject(row));
        
        switch(filter){
          case undefined: // no filter passed
            break;
          case "private":
            tasks = tasks.filter(t => t.priv);
            break;
          case "important":
            tasks = tasks.filter(t => t.important);
            break;
          case "today":
            tasks = tasks.filter( t => t.isToday());
            break;
          case "sevendays":
            tasks = tasks.filter( t => t.isNextWeek());
            break;
          default:
            tasks = []; // unknown filter
        }
        
        resolve(tasks);
      }
    })

  });
}

// get task by id
exports.getTask = (id) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM tasks WHERE id = ?';
    db.all(query, [id], (err, rows) => {
      if(err)
        reject(err);
      else if(rows.length === 0)
        resolve(undefined);
      else{
        const task = createTaskObject(rows[0]);
        resolve(task);
      }
    });
  });
}

// delete task
exports.deleteTask = (id) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM tasks WHERE id = ?';
    db.run(query, [id], (err) => {
      if(err)
        reject(err);
      else
        resolve(null);
    })
  });
}

// update task
exports.updateTask = (id, task) => {
   return new Promise((resolve, reject) => {
     const query = 'UPDATE tasks SET description=?,important=?,private=?, deadline = DATETIME(?), completed=?,user=? WHERE id = ?';
     // employs param id to avoid using the new task's one (might be different)
     db.run(query, [task.description, task.important, task.priv, task.deadline, task.completed, task.user, id], function (err) {
       if (err) {
         console.log(err);
         reject(err);
         return;
       }
       resolve(this.lastID);
     });
   });
 }
