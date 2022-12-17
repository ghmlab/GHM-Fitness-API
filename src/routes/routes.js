const express = require('express');
const controllers = require('../controllers/fitness.js')
const verifyToken = require('./verifyToken.js')


const router = express.Router();

router.get('/getAllData', verifyToken, controllers.getAllData)
router.post('/register', controllers.registerUser)
router.post('/login', controllers.loginUser)

module.exports = router