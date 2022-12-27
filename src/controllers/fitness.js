const moment = require('moment');
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
            res.send({
                success: true,
                data:data
            })
        })
    }
    catch(err){
        res.send("error", err)
    }
}

//----------------------GET USER BY ID --------------------------------------//

const getUserData = async (req, res) => {

    const user = await fitnessData.findOne({email: req.params.id})
    
    if(!user) return res.status(400).send("User not found")

    res.send({
        success: true,
        user: user
    })
}

//----------------------REGISTER USER--------------------------------------//

const registerUser = async (req, res) => {

    const error = validation.register(req.body)
    if(error) return res.status(400).send(error)

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
            trips:[],
            orders: []
        })

        res.send({
            success: true,
            message: "Welcome to GHM Fitness"
        })
    }
    catch(err){
        res.send("ERROR : Couldn't push data", err)
    }
}

//----------------------LOGIN USER --------------------------------------//
const loginUser = async (req, res) => {

    // VALIDATING LOGIN DETAILS
    const error = validation.login(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    // CHECKING IF EMAIL EXISTS IN THE DATABASE
    const user = await fitnessData.findOne({email: req.body.email})
    if(!user) return res.status(400).send("Invalid Email")

    // CHECKING IF THE PASSWORD IS VALID 
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).send("The password is incorrect");
    
    // CREATING A JWT TOKEN 
    
    const token = jwt.sign({_id: user._id }, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send({
        success: true,
        token: token
    })


    // res.send("Logged In Successfully")

}
//----------------------UPDATE TRIPS--------------------------------------//

const updateTrips = async (req, res) => {
    
    const startTime = req.body.startTime
    const endTime = req.body.endTime
    const calories = req.body.calories
    const distance = req.body.distance
    const coins = req.body.coins
    const duration = req.body.duration

    // GETTING USER DATA FROM URL REQUEST PARAMETERS
    const userData = await fitnessData.findOne({email: req.params.id}, (user) => {
        
        if(!user) return res.status(400).send("User not found")

        res.send("user")
       
    })
    
    // STORING THE TRIPS ARRAY
    let updateTrip
    
    if(userData){
        updateTrip = userData.trips
        tripLength = updateTrip.length
    }

    // PUSHING DATA INTO ARRAY
    updateTrip.push({
        date: moment().unix(),
        startTime: startTime,
        endTime: endTime,
        calories: calories,
        distance: distance,
        coins: coins,
        duration: duration
    })
    

    // SENDING DATA TO MONGODB SERVER
    await fitnessData.findOneAndUpdate({email: req.params.id}, {$set: {trips: updateTrip}}).then((updatedData) => {
        if(updatedData.trips.length < tripLength) return res.status(400).send("Update Failed")
        
        res.send("Update Successful")

    })
    
}





module.exports = {
    getAllData,
    registerUser,
    loginUser,
    updateTrips,
    getUserData
}






/* 
{
    "password": "abcdefghi",
    "email": "ali@gmail.com",
    "username": "Ali Reza",
    "phone": "9988776655"
}
vc 
*/