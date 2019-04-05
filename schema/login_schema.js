const Joi = require("Joi");
const schema = {
    userName: Joi.string().optional(),
    password: Joi.string().optional(),
    captchaToken: Joi.string().optional(),
};

module.exports.schema = schema;
module.exports.format = (args) => {
    return [args.userName, args.password, args.captchaToken];
};