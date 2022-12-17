const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const routes = require('./routes/routes.js')

const app = express()
const PORT = process.env.PORT || 9090;

app.use(cors())

app.use(bodyParser.json());

app.use('/', routes)

app.listen(PORT, () => console.log('App listening on port 9090'))