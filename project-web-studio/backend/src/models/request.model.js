const mongoose = require('mongoose');
const config = require('../config/config');

const RequestSchema = new mongoose.Schema({
    name: String,
    phone: String,
    service: String,
    date: Date,
    type: {
        type: String,
        enum: [config.requestTypes.order, config.requestTypes.consultation],
        default: config.requestTypes.order
    }
});

const RequestModel = mongoose.model('Request', RequestSchema);

module.exports = RequestModel;