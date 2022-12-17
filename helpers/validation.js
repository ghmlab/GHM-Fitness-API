const Joi = require('@hapi/joi')

const register = (user) => {
    const validateSchema = Joi.object({
        username: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        phone:Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    }).options({ stripUnknown: true });

    return validateSchema.validate(user)
}

const login = (user) => {
    const validateSchema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    }).options({ stripUnknown: true });

    return validateSchema.validate(user)
}


module.exports = {
    register,
    login
}