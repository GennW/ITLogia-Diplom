const ArticleModel = require("../models/article.model");
const ArticleNormalizer = require("../normalizers/article.normalizer");
const CategoryModel = require("../models/category.model");
const CommentModel = require("../models/comment.model");

class ArticleController {

    static async getArticles(req, res) {
        const itemsPerPage = 8;
        const page = parseInt(req.query['page'], 10) || 1;

        const filter = {};

        let articlesQuery;
        let articlesQueryCount;
        if (req.query['categories']) {
            const categoryModels = await CategoryModel.find({'url': {$in: req.query['categories']}});
            const categoryModelsIds = categoryModels.map(item => (item.id));
            filter.category = {$in: categoryModelsIds};
        }

        articlesQuery = ArticleModel.find(filter).populate('category');
        articlesQueryCount = ArticleModel.count(filter);

        articlesQuery.limit(itemsPerPage).skip(itemsPerPage * (page - 1));

        let articles = await articlesQuery;
        let articlesCount = await articlesQueryCount;
        articles = articles.map(item => ArticleNormalizer.normalize(item));
        res.json({
            count: articlesCount,
            pages: Math.ceil(articlesCount / itemsPerPage),
            items: articles
        });
    }

    static async getTopArticles(req, res) {
        let articles = await ArticleModel
            .find()
            .populate('category')
            .limit(4)
            .lean();

        articles = articles.map(item => ArticleNormalizer.normalize(item));
        res.json(articles);
    }

    static async getRelatedArticles(req, res) {
        const {url} = req.params;
        if (!url) {
            return res.status(400)
                .json({error: true, message: "Не передан параметр url"});
        }

        let article = await ArticleModel.findOne({url: url});
        if (!article) {
            return res.status(404)
                .json({error: true, message: "Статья не найдена"});
        }

        let articles = await ArticleModel
            .find({'category': article.category.toString(), _id: {$ne: article._id}})
            .populate('category')
            .limit(2)
            .lean();

        articles = articles.map(item => ArticleNormalizer.normalize(item));
        res.json(articles);
    }

    static async getArticle(req, res) {
        const {url} = req.params;
        if (!url) {
            return res.status(400)
                .json({error: true, message: "Не передан параметр url"});
        }

        let article = await ArticleModel.findOne({url: url}).populate('category');

        const comments = await CommentModel.find({article: article._id})
            .populate('user')
            .sort({date: -1});

        article.comments = comments.slice(0,3);
        article.commentsCount = comments.length;

        res.json(ArticleNormalizer.normalize(article, true));
    }
}

module.exports = ArticleController;