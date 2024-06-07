const config = require('../config/config');
const mongoose = require('mongoose');

const UserCommentActionSchema = new mongoose.Schema({
    action: {
        type: String,
        enum: [config.userCommentActions.like, config.userCommentActions.dislike, config.userCommentActions.violate],
        default: config.userCommentActions.like
    },
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    comment: {type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true},
});

const UserCommentActionModel = mongoose.model('UserCommentAction', UserCommentActionSchema);

module.exports = UserCommentActionModel;