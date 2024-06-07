const Joi = require("@hapi/joi");
const config = require("../config/config");

class ValidationUtils {
    static signupValidation(data) {
        const schema = Joi.object({
            name: Joi.string(),
            email: Joi.string().min(6).required().email()
                .messages({
                    'string.empty': `Необходимо заполнить "E-mail"`,
                    'string.email': `"E-mail" неверный`,
                    'string.min': `"E-mail" неверный`,
                    'any.required': `Необходимо заполнить "E-mail"`
                }),
            password: Joi.string().min(6).required()
                .messages({
                    'string.empty': `Необходимо заполнить "Пароль"`,
                    'string.min': `"Пароль" должен иметь минимум 6 символов`,
                    'any.required': `Необходимо заполнить "Пароль"`
                }),
        });
        return schema.validate(data);
    }

    static loginValidation(data) {
        const schema = Joi.object({
            email: Joi.string().min(6).required().email()
                .messages({
                    'string.empty': `Необходимо заполнить "E-mail"`,
                    'string.email': `"E-mail" неверный`,
                    'string.min': `"E-mail" неверный`,
                    'any.required': `Необходимо заполнить "E-mail"`
                }),
            password: Joi.string().min(6).required()
                .messages({
                    'string.empty': `Необходимо заполнить "Пароль"`,
                    'string.min': `"Пароль" должен иметь минимум 6 символов`,
                    'any.required': `Необходимо заполнить "Пароль"`
                }),
            rememberMe: Joi.boolean().default(false),
        });
        return schema.validate(data);
    }

    static refreshTokenValidation(data) {
        const schema = Joi.object({
            refreshToken: Joi.string().required()
                .messages({
                    'string.empty': `Необходимо заполнить "Токен"`,
                    'any.required': `Необходимо заполнить "Токен"`
                }),
        });
        return schema.validate(data);
    }

    static makeRequestValidation(data) {
        const schema = Joi.object({
            name: Joi.string().required()
                .messages({
                    'string.empty': `Необходимо заполнить "Имя"`,
                    'any.required': `Необходимо заполнить "Имя"`
                }),
            phone: Joi.string().required()
                .messages({
                    'string.empty': `Необходимо заполнить "Телефон"`,
                    'any.required': `Необходимо заполнить "Телефон"`
                }),
            type: Joi.string().required().valid(...Object.values(config.requestTypes))
                .messages({
                    'string.empty': `Необходимо заполнить "Тип"`,
                    'any.only': `Тип может быть только: ` + Object.values(config.requestTypes).join(','),
                    'any.required': `Необходимо заполнить "Тип"`
                }),
            service: Joi
                .when('type', {
                    is: config.requestTypes.order,
                    then: Joi.string().required(),
                    otherwise: Joi.string()
                })
                .messages({
                    'string.base': `"Услуга" должен быть строкой`,
                    'string.empty': `Необходимо заполнить "Услуга"`,
                    'any.required': `Необходимо заполнить "Услуга"`
                }),
        });
        return schema.validate(data);
    }

    static addCommentValidation(data) {
        const schema = Joi.object({
            text: Joi.string().required()
                .messages({
                    'string.empty': `Необходимо заполнить "Текст"`,
                    'any.required': `Необходимо заполнить "Текст"`
                }),
            article: Joi.string().required()
                .messages({
                    'string.empty': `Необходимо заполнить "Статья"`,
                    'any.required': `Необходимо заполнить "Статья"`
                }),
        });
        return schema.validate(data);
    }

    static applyActionCommentValidation(data) {
        const schema = Joi.object({
            action: Joi.string().required().valid(...Object.values(config.userCommentActions))
                .messages({
                    'string.empty': `Необходимо заполнить "Действие"`,
                    'any.only': `Действие может быть только: ` + Object.values(config.userCommentActions).join(','),
                    'any.required': `Необходимо заполнить "Действие"`
                }),
        });
        return schema.validate(data);
    }
}

module.exports = ValidationUtils;