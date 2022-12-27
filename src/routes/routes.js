const express = require('express');
const controllers = require('../controllers/fitness.js')
const shopControllers = require('../controllers/shop.js')

const verifyToken = require('./verifyToken.js')


const router = express.Router();

router.get('/getAllData', verifyToken, controllers.getAllData)
router.post('/register', controllers.registerUser)
router.post('/login', controllers.loginUser)
router.post('/updateTrips/:id', controllers.updateTrips)
router.get('/user/:id', controllers.getUserData)

router.get('/getShop',shopControllers.fetchShopData)
router.post('/postToShop', shopControllers.postShopData)

module.exports = router