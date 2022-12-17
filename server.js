const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors')
const dotenv = require('dotenv')
const routes = require('./src/routes/routes.js')

const app = express()
const PORT = process.env.PORT || 3000;

app.use(cors())

app.use(bodyParser.json());

app.get('/', function(req, res){
    res.sendFile(__dirname + '/dist/index.html');
});

app.use('/', routes)

app.listen(PORT, () => console.log('App listening on port 3000'))