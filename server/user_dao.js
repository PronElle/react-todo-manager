'use strict';
const User = require('./user');
const db = require('./db');
const bcrypt = require('bcrypt');

const createUserObject = (row) => {
  return new User(row.id, row.name, row.email, row.hash);
}

exports.getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.get(query, [email], (err, row) => {
      if (err)
        reject(err); // DB error
      else if (row === undefined)
        resolve(undefined); // user not found
      else {
        bcrypt.compare(password, row.hash).then( matches => {
          if (matches) // password matches
            resolve(createUserObject(row));
          else
            resolve(false); // password not matching
        });
      }
    });
  });
}

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    db.get(query, [id], (err, row) => {
      if (err)
        reject(err);
      else if (row === undefined)
        resolve({ error: 'User not found.' });
      else {
        const user = createUserObject(row);
        resolve(user);
      }
    });
  });
};

