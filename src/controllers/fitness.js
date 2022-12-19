const moment = require('moment');
const uuid = require('uuid')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')

// const Joi = require('@hapi/joi')
const bcrypt = require('bcryptjs')
const validation = require('../helpers/validation')
//----------------------DATABASE CONNECT--------------------------------------//
dotenv.config()
const db = require('monk')(process.env.DB_CONNECT)
const fitnessData = db.get("ghmfitness")

//----------------------GET ALL DATA --------------------------------------//

const getAllData = (req, res) => {
    try{
        fitnessData.find().then((data) => {
            res.send(data)
        })
    }
    catch(err){
        res.send("error", err)
    }
}

//----------------------REGISTER USER--------------------------------------//

const registerUser = async (req, res) => {

    const {error} = validation.register(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    //Checking if the user already exists
    const emailExists = await fitnessData.findOne({email: req.body.email})
    if(emailExists) return res.status(400).send('Email address already exists')

    const phoneExists = await fitnessData.findOne({phone: req.body.phone})
    if(phoneExists) return res.status(400).send('Phone Number already exists')

    //---- HASHING THE PASSWORD -----

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    //---Creating a new user-----
    const username = req.body.username
    const password = hashedPassword
    const email = req.body.email
    const phone = req.body.phone
    const model = req.body.model

    //Pushing Data to the database
    try{
        fitnessData.insert({
            username: username,
            password: password,
            email: email,
            phone: phone,
            model: model,
            date: moment().unix(),
            trips: []
        })

        res.send("Welcome to GHM Fitness")
    }
    catch(err){
        console.log("ERROR : Couldn't push data", err)
    }
}

const loginUser = async (req, res) => {

    // VALIDATING LOGIN DETAILS
    const {error} = validation.login(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    // CHECKING IF EMAIL EXISTS IN THE DATABASE
    const user = await fitnessData.findOne({email: req.body.email})
    if(!user) return res.status(400).send("Invalid Email")

    // CHECKING IF THE PASSWORD IS VALID 
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).send("The password is incorrect");
    
    // CREATING A JWT TOKEN 
    
    const token = jwt.sign({_id: user._id }, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token)


    // res.send("Logged In Successfully")

}



module.exports = {
    getAllData,
    registerUser,
    loginUser
}