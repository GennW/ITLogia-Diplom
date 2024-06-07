const express = require('express');
const CommentController = require("../controllers/comment.controller");
const router = express.Router();
const Auth = require("../utils/common/auth");

router.post('/', Auth.authenticate, CommentController.addComment);
router.get('/', CommentController.getComments);
router.post('/:id/apply-action', Auth.authenticate, CommentController.applyActionComment);
router.get('/:id/actions', Auth.authenticate, CommentController.getCommentActions);
router.get('/article-comment-actions', Auth.authenticate, CommentController.getArticleCommentActions);

module.exports = router;