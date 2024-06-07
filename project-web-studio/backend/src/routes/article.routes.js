const express = require('express');
const ArticleController = require("../controllers/article.controller");
const router = express.Router();

router.get('/', ArticleController.getArticles);
router.get('/top', ArticleController.getTopArticles);
router.get('/related/:url', ArticleController.getRelatedArticles);
router.get('/:url', ArticleController.getArticle);

module.exports = router;