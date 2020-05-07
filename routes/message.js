var express = require('express')
var messageController = require('../controllers/MessageController')
var multiParty = require('connect-multiparty')
var path = multiParty({uploadDir: './uploads/perfiles'})

var app = express.Router()

app.post('/mensaje/enviar', messageController.send)
app.get('/mensajes/:de/:para', messageController.data_msm)

module.exports = app