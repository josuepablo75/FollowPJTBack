var Message = require('../models/message');
var jwt = require('../helpers/jwt');
var path = require('path');

function send(req,res){
    let data = req.body;
    console.log(data);
    var message = new Message();
    console.log(message);

    message.de = data.de;
    message.para = data.para;
    message.msn = data.msn;

    message.save((err,message_save)=>{
        if(err){
            res.status(500).send({
                message: 'Error en el servidor.'});
        }else{
            if(message_save){
                res.status(200).send({
                    message: message_save
                });
            }
        }
    })
}

function data_msn(req,res){
    var data = req.body;
    var de = req.params['de'];
    var para= req.params['para'];

    const filtro = {
        '$or':[
            {'$and':[
                {
                    'para': de
                },{
                    'de': para
                }
            ]                
            },{
                '$and': [
                    {
                        'para': para
                    },{
                        'de': de
                    }
                ]
            },
        ]
    }
    
    

    Message.find(filtro).sort({createAt:1}).exec(function(err,messages){
        if(messages){
            res.status(200).send({messages: messages});
        }else{ 
            res.status(404).send({message: 'No hay ningun mensaje.'});
        }
    });
}

module.exports = {
    send,
    data_msn
}