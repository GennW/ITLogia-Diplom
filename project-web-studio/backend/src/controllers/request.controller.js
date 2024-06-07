const RequestModel = require("../models/request.model");
const ValidationUtils = require("../utils/validation.utils");
const mongoose = require('mongoose');

class RequestController {
    static async makeRequest(req, res) {
        const {error} = ValidationUtils.makeRequestValidation(req.body);

        if (error) {
            console.log(error.details);
            return res.status(400).json({error: true, message: error.details[0].message});
        }

        let request = new RequestModel();
        request.name = req.body.name;
        request.phone = req.body.phone;
        if (req.body.service) {
            request.service = req.body.service;
        }
        request.date = new Date();
        request.type = req.body.type;

        await request.save();

        res.status(200).json({error: false, message: "Запрос успешно отправлен!"});
    }
}

module.exports = RequestController;