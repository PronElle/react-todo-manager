class User{    
    constructor(id, name, email, hashpasswd) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.hashpasswd = hashpasswd;
    }
}

module.exports = User;