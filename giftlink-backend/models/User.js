const bcrypt = require('bcryptjs');

class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    // Hash password before saving
    async hashPassword() {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    // Compare password for login
    async comparePassword(candidatePassword) {
        return await bcrypt.compare(candidatePassword, this.password);
    }
}

module.exports = User;