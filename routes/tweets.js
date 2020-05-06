var express = require('express')
var tweetsController = require('../controllers/TweetController')

var app = express.Router()

app.post('/tweet/publicar', tweetsController.publicar);
app.put('/tweet/editar/:id', tweetsController.editar_publicacion);
app.post('/tweet/eliminar/:id', tweetsController.eliminar_publicacion);
app.get('/tweet/get_tweets/:id', tweetsController.get_tweets);
app.get('/tweet/tweets_seguidos/:id', tweetsController.get_tweets_seguidos);

module.exports = app