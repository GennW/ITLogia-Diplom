const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
    title: String,
    description: String,
    text: String,
    image: String,
    date: Date,
    viewsCount: Number,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    url: String
});

const ArticleModel = mongoose.model('Article', ArticleSchema);

module.exports = ArticleModel;