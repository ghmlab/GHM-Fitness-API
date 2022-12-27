 

const register = (user) => {
    // const validateSchema = Joi.object({
    //     username: Joi.string().min(6).required(),
    //     email: Joi.string().min(6).required().email(),
    //     password: Joi.string().min(6).required(),
    //     phone:Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    // }).options({ stripUnknown: true });

    // return validateSchema.validate(user)
    if(user.username === '' || user.password === '' || user.email === '' || user.phone === ''){
        return {
            error: 'All fields are required. No field should be left empty'
        }
    }

    if(user.username.length < 6){
        return{
            error: 'Username should be minimum 6 characters'
        }
    }

    // EMAIL VALIDATION 
    const emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/

    if(!emailFilter.test(user.email)){
        return {
            error: 'Invalid Email. Please enter the correct email address'
        }
    }

    // PHONE VALIDATION 
    const phoneFilter = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/
    if(!phoneFilter.test(user.phone)){
        return{
            error: 'Invalid Phone Number'
        }
    }

    // PASSWORD VALIDATION

    if(user.password.length < 6){
        return{
            error: 'Password length should be minimum 6 characters'
        }
    }


}

const login = (user) => {
    // const validateSchema = Joi.object({
    //     email: Joi.string().min(6).required().email(),
    //     password: Joi.string().min(6).required(),
    // }).options({ stripUnknown: true });

    // return validateSchema.validate(user)
    const emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/

    if(!emailFilter.test(user.email)){
        return {
            error: 'Invalid Email. Please enter the correct email address'
        }
    }

    if(user.password.length < 6){
        return{
            error: 'Password length should be minimum 6 characters'
        }
    }
}


module.exports = {
    register,
    login
}