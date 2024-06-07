const BaseNormalizer = require("./base.normalizer");

class CommentNormalizer extends BaseNormalizer {
    static normalize(comment, withUser = true) {
        const basicObject = {
            id: comment.id,
            text: comment.text,
            date: comment.date,
            likesCount: comment.likesCount,
            dislikesCount: comment.dislikesCount,
        }

        if (withUser) {
            basicObject.user = {
                id: comment.user._id,
                name: comment.user.name,
            };
        }

        return basicObject;
    }
}

module.exports = CommentNormalizer;