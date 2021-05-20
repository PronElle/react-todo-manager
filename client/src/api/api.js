import Task from './Task';


/* --- week 2 ---- */
async function getTasks(filter) {
    let url = '/tasks';
    if(filter){
        url += "?filter=" + filter;
    }

    const response = await fetch(url);
    const tasksJson = await response.json();

    if(response.ok){
        return tasksJson.map( t => new Task(t.id,t.description,t.important, t.priv, t.deadline, t.completed,t.user));
    } else {
        throw tasksJson;
    }
}

async function addTask(task){
    // TODO: to be implemented
}

/* --- week 3 --- */
async function updateTask(id){
    // TODO: to be implemented
}

async function deleteTask(id){
    // TODO: to be implemented
}

const API = { getTasks, addTask, updateTask, deleteTask };
export default API; 