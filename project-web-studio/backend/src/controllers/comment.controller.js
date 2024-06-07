const CommentModel = require("../models/comment.model");
const ValidationUtils = require("../utils/validation.utils");
const mongoose = require('mongoose');
const CommentNormalizer = require("./../normalizers/comment.normalizer");
const UserCommentActionModel = require("../models/user-comment-action.model");
const config = require("../config/config");
const UserCommentActionNormalizer = require("../normalizers/user-comment-action.normalizer");
const ArticleModel = require("../models/article.model");

class CommentController {
    static async addComment(req, res) {
        const {error} = ValidationUtils.addCommentValidation(req.body);

        if (error) {
            console.log(error.details);
            return res.status(400).json({error: true, message: error.details[0].message});
        }

        let comment = new CommentModel();
        comment.text = req.body.text;
        comment.date = new Date();
        comment.user = new mongoose.Types.ObjectId(req.user.id);
        comment.article = new mongoose.Types.ObjectId(req.body.article);

        const result = await comment.save();

        res.status(200).json({error: false, message: "Комментарий добавлен!"});
    }

    static async getComments(req, res) {
        const {article} = req.query;

        if (!article) {
            return res.status(400)
                .json({error: true, message: "Не передан параметр url"});
        }

        const offset = req.query['offset'] || 3;
        const loadCount = 10;

        let comments = await CommentModel.find({article: article})
            .populate('user')
            .sort({date: -1});

        let slicedComments = comments.slice(parseInt(offset), parseInt(offset) + loadCount);

        return res.json({
            allCount: comments.length,
            comments: slicedComments.map(item => CommentNormalizer.normalize(item))
        });
    }

    static async applyActionComment(req, res) {
        const {error} = ValidationUtils.applyActionCommentValidation(req.body);

        if (error) {
            console.log(error.details);
            return res.status(400).json({error: true, message: error.details[0].message});
        }

        const {id} = req.params;
        if (!id) {
            return res.status(400)
                .json({error: true, message: "Не передан параметр id"});
        }

        let comment = await CommentModel.findOne({_id: id}).populate('user');
        if (!comment) {
            return res.status(404)
                .json({error: true, message: "Комментарий не найден"});
        }

        let commentUserAction = await UserCommentActionModel.findOne({
            comment: id,
            user: req.user.id,
            action: req.body.action
        }).populate('user');
        if (commentUserAction) {
            if (commentUserAction.action === config.userCommentActions.violate) {
                return res.status(400)
                    .json({error: true, message: "Это действие уже применено к комментарию"});
            } else {
                await commentUserAction.remove();
                if (commentUserAction.action === config.userCommentActions.like) {
                    if (comment.likesCount > 0) {
                        comment.likesCount -= 1;
                    }
                } else if (commentUserAction.action === config.userCommentActions.dislike) {
                    if (comment.dislikesCount > 0) {
                        comment.dislikesCount -= 1;
                    }
                }
                const result = await comment.save();
                console.log(result);

                return res.status(200).json({error: false, message: "Успешное действие!"});
            }
        }

        commentUserAction = new UserCommentActionModel();
        commentUserAction.user = new mongoose.Types.ObjectId(req.user.id);
        commentUserAction.comment = new mongoose.Types.ObjectId(id);
        commentUserAction.action = req.body.action;
        const result = await commentUserAction.save();
        if (result) {
            if (commentUserAction.action === config.userCommentActions.like) {
                let dislikeCommentUserAction = await UserCommentActionModel.findOne({
                    comment: id,
                    user: req.user.id,
                    action: config.userCommentActions.dislike
                });
                if (dislikeCommentUserAction) {
                    await dislikeCommentUserAction.remove();
                    if (comment.dislikesCount > 0) {
                        comment.dislikesCount -= 1;
                    }
                }
                comment.likesCount += 1;
            } else if (commentUserAction.action === config.userCommentActions.dislike) {
                let likeCommentUserAction = await UserCommentActionModel.findOne({
                    comment: id,
                    user: req.user.id,
                    action: config.userCommentActions.like
                });
                if (likeCommentUserAction) {
                    await likeCommentUserAction.remove();
                    if (comment.likesCount > 0) {
                        comment.likesCount -= 1;
                    }
                }
                comment.dislikesCount += 1;
            } else if (commentUserAction.action === config.userCommentActions.violate) {
                comment.violatesCount += 1;
            }

            const result = await comment.save();
            console.log(result);
        }

        res.status(200).json({error: false, message: "Успешное действие!"});
    }

    static async getCommentActions(req, res) {
        const {id} = req.params;
        if (!id) {
            return res.status(400)
                .json({error: true, message: "Не передан параметр id"});
        }

        let commentUserActions = await UserCommentActionModel.find({
            comment: id,
            user: req.user.id,
            action: {$ne: config.userCommentActions.violate}
        }).lean();

        commentUserActions = commentUserActions.map(item => UserCommentActionNormalizer.normalize(item));
        res.json(commentUserActions);
    }

    static async getArticleCommentActions(req, res) {
        const {articleId} = req.query;

        if (!articleId) {
            return res.status(400)
                .json({error: true, message: "Не передан параметр articleId для article"});
        }

        let article = await ArticleModel.findOne({_id: articleId});
        if (!article) {
            return res.status(404)
                .json({error: true, message: "Статья не найдена"});
        }

        let comments = await CommentModel.find({article: articleId}).sort({date: -1});
        if (!comments || (comments && comments.length === 0)) {
            return res.json([]);
        }

        let commentUserActions = await UserCommentActionModel.find({
            comment: {$in: comments.map(item => item._id.toString())},
            user: req.user.id,
            action: {$ne: config.userCommentActions.violate}
        }).lean();

        commentUserActions = commentUserActions.map(item => UserCommentActionNormalizer.normalize(item));
        res.json(commentUserActions);
    }
}

module.exports = CommentController;