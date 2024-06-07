const BaseNormalizer = require("./base.normalizer");

class UserNormalizer extends BaseNormalizer {
    static normalize(user) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
        }
    }
}

module.exports = UserNormalizer;