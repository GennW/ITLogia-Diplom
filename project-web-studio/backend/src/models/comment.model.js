const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    text: String,
    date: Date,
    likesCount: {type: Number, default: 0},
    dislikesCount: {type: Number, default: 0},
    violatesCount: {type: Number, default: 0},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
});

const CommentModel = mongoose.model('Comment', CommentSchema);

module.exports = CommentModel;