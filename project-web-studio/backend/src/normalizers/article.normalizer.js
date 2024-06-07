const BaseNormalizer = require("./base.normalizer");
const CommentNormalizer = require("./comment.normalizer");

class ArticleNormalizer extends BaseNormalizer {
    static normalize(article, detail = false) {
        let obj = {
            id: article._id.toString(),
            title: article.title,
            description: article.description,
            image: article.image,
            date: article.date,
            category: article.category.name,
            url: article.url,
            // category: {
            //     id: article.category._id,
            //     name: article.category.name,
            //     url: article.category.url
            // },
        };

        if (detail) {
            obj = Object.assign({
                text: article.text,
                comments: article.comments ? article.comments.map(item => CommentNormalizer.normalize(item)) : [],
                commentsCount: article.commentsCount
            }, obj);
        }

        return obj;
    }
}

module.exports = ArticleNormalizer;