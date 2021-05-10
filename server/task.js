class Task {    
    constructor(id, description, important, priv, deadline, completed) {
        this.id = id;
        this.description = description;
        this.important = important;
        this.priv = priv;
        this.deadline = deadline;
        this.completed = completed || false;
    }
}

module.exports = Task;