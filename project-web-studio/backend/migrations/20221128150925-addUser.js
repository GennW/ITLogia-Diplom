const crypto = require('crypto');

module.exports = {
    async up(db, client) {
        const salt = crypto.randomBytes(128).toString('base64');
        const passwordHash = crypto.pbkdf2Sync('12345678', salt, 1, 128, 'sha1').toString('base64');
        await db.collection('users').insertOne({
            name: 'Тест',
            email: 'test@gmail.com',
            passwordHash: passwordHash,
            salt: salt,
        });
    },

    async down(db, client) {
    }
};
