var Tweets = require('../models/tweets');
var User = require('../models/user');

var path = require('path');

function publicar(req, res) {

    let data = req.body;
    var tweet = new Tweets();

    tweet.texto = data.texto;
    tweet.user = data.user;

    if ( data.texto) {

        tweet.save((err, tweet) => {
            if (tweet) {
                res.status(200).send({
                    tweet: tweet
                });
            } else {
                res.status(404).send({
                    message: err
                });
            }
        })

    } else {
        res.status(404).send({
            message: 'Ingrese publicacion'
        });
    }
}

function editar_publicacion(req, res){
    let id = req.params['id'];
    let data = req.body;
    if (data.texto) {
     
        Tweets.findByIdAndUpdate(id, {
            texto: data.texto
        }, (err, tweet_update) => {
            if (err) {
                res.status(500).send({
                    message: 'Error en el servidor'
                });
            } else {
                if (tweet_update) {
                    res.status(200).send({
                        tweet: tweet_update
                    });
                } else {
                    res.status(500).send({
                        message: 'No se encontro el usuario'
                    });
                }
            }
        })
    } else {
        res.status(404).send({
            message: 'Seleccione una imagen'
        });
    }
}

function eliminar_publicacion(req, res) {
    let id = req.params['id'];
   

        Tweets.findByIdAndDelete(id, (err, tweet_update) => {
            if (err) {
                res.status(500).send({
                    message: 'Error en el servidor'
                });
            } else {
                if (tweet_update) {
                    res.status(200).send({
                        message: 'Eliminado correctamente'
                    });
                } else {
                    res.status(500).send({
                        message: 'No se encontro la publicacion'
                    });
                }
            }
        })
    
}

function get_tweets(req, res) {
    let id = req.params['id'];

    Tweets.find({user: id}, (err, tweets) => {
        if (err) {
            res.status(500).send({
                message: 'Error en el servidor'
            });
        } else {
            if (tweets) {
                res.status(200).send({
                    tweets: tweets
                });
            } else {
                res.status(404).send({
                    message: 'No existe un usuario con ese id'
                });
            }
        }
    })
}

async function get_tweets_seguidos(req, res){
     let id = req.params['id'];

       let userseguido = await User.findById(id, {
           follow: true
       });
       var array_users = [];
       try {
          array_users = userseguido.follow;
       } catch (error) {
           
       }
       
        array_users.push(id);

        Tweets.find({
                    "user": {
                        $in: array_users
                        
                    }
                }, (err, tweets) => {
                    if (err) {
                        res.status(500).send({
                            message: 'Error en el servidor'
                        });
                    } else {
                        if (tweets) {
                            res.status(200).send({
                                tweets: tweets
                            });
                        } else {
                            res.status(404).send({
                                message: 'No existen publicaciones'
                            });
                        }
                    }
                })
}


module.exports = {
    publicar, 
    editar_publicacion, 
    eliminar_publicacion, 
    get_tweets, 
    get_tweets_seguidos

}