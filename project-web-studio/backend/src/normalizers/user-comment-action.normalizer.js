const BaseNormalizer = require("./base.normalizer");

class UserCommentActionNormalizer extends BaseNormalizer {
    static normalize(userCommentAction, withUser = true) {
        return {
            comment: userCommentAction.comment,
            action: userCommentAction.action,
        }
    }
}

module.exports = UserCommentActionNormalizer;