const crypto = require('crypto');
const mongoose = require('mongoose');
const randomBytesNum = 128;

const UserSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: 'e-mail is required',
        unique: 'this e-mail already exist',
    },
    salt: String,
    passwordHash: String,
    refreshToken: String,
}, {
    timestamps: true,
});

UserSchema.methods.checkPassword = function (password) {
    if (!password) {
        return false;
    }
    if (!this.passwordHash) {
        return false;
    }

    const hash = crypto.pbkdf2Sync(password, this.salt, 1, randomBytesNum, 'sha1');
    if (hash.toString() === this.passwordHash) {
        return true;
    }

    return hash.toString('base64') === this.passwordHash;
};
UserSchema.methods.setPassword = function (password) {
    if (!password) {
        return false;
    }
    this.salt = crypto.randomBytes(randomBytesNum).toString('base64');
    this.passwordHash = crypto.pbkdf2Sync(password, this.salt, 1, randomBytesNum, 'sha1').toString('base64');
};

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;