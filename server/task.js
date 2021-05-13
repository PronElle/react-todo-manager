'use strict';

const dayjs = require('dayjs');

class Task {    
    constructor(id, description, important, priv, deadline, completed, user) {
        this.id = id;
        this.description = description;
        this.important = important;
        this.priv = priv;
        this.deadline = deadline ? dayjs(deadline) : undefined;
        this.completed = completed || false;
        this.user = user;
    }

    isToday(){
        return this.deadline?.isSame(dayjs(), 'day') || false;
    }

    isNextWeek(){
        return this.deadline?.isAfter(dayjs()) && this.deadline?.isBefore(dayjs().add(7, 'day')) || false;
    }
}

module.exports = Task;

