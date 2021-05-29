import Task from './Task';

/* --- week 2 ---- */
async function getTasks(filter) {
    let url = '/tasks';
    if (filter) {
        url += "?filter=" + filter;
    }

    const response = await fetch(url);
    const tasksJson = await response.json();

    if (response.ok) {
        return tasksJson.map(t => new Task(t.id, t.description, t.important, t.priv, t.deadline, t.completed, t.user));
    } else {
        throw tasksJson;
    }
}

async function addTask(task) {
    const response = await fetch('/tasks', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    });

    return response.ok ? null : { 'err': 'POST error' };
}

/* --- week 3 --- */
async function updateTask(task) {
    const response = await fetch('/tasks/' + task.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
    });
    
    return response.ok ? null : { 'err': 'PUT error' };
}

async function deleteTask(id) {
    return new Promise((resolve, reject) => {
        fetch("/tasks/" + id, {
            method: 'DELETE'
        }).then( response => {
            if(response.ok) 
                resolve(null);
        }).catch( err => reject({'err': 'DELETE error'})); // connection errors
    });
}


        /* --- Functions that call API at server side (login-logout-getUserinfo) ---- */
const BASEURL = '/api';
async function logIn(credentials) {
    let response = await fetch('/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    if(response.ok) {
      const user = await response.json();
      return user.name;
    }
    else {
      try {
        const errDetail = await response.json();
        throw errDetail.message;
      }
      catch(err) {
        throw err;
      }
    }
  }
  
  async function logOut() {
    await fetch('/api/sessions/current', { method: 'DELETE' });
  }
  
  async function getUserInfo() {
    const response = await fetch(BASEURL + '/sessions/current');
    const userInfo = await response.json();
    if (response.ok) {
      return userInfo;
    } else {
      throw userInfo;  // an object with the error coming from the server
    }
  }
/////////////////////////////////////////////////////////////////////////////

const API = { getTasks, addTask, updateTask, deleteTask, logIn, logOut, getUserInfo};
export default API;