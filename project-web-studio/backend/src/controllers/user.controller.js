const UserNormalizer = require("../normalizers/user.normalizer");
const UserModel = require("../models/user.model");

class UserController {
    static async getUser(req, res) {
        const user = await UserModel.findOne({_id: req.user.id});

        if (!user) {
            return res.status(404)
                .json({error: true, message: "Пользователь не найден"});
        }

        res.json(UserNormalizer.normalize(user, true));
    }
}

module.exports = UserController;