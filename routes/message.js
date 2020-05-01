var express = require('express')
var messageController = require('../controllers/MessageController')
var multiParty = require('connect-multiparty')
var path = multiParty({uploadDir: './uploads/perfiles'})

var api = express.Router()

api.post('/mensaje/enviar',messageController.send)
api.get('/mensajes/:de/:para',messageController.data_msn)

module.exports = api