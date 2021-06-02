import dayjs from 'dayjs';

class Task{    
        constructor(id, description, important, priv, deadline, completed, user) {
        this.id = id;
        this.description = description;
        this.important = important;
        this.priv = priv;
        this.deadline = deadline ? dayjs(deadline) : undefined;
        this.completed = completed || false;
        this.user = user;
    }
}

export default Task;