var bodyparser = require('body-parser');
var mongose = require('mongoose');
var port = process.env.PORT || 4201;
var express = require('express'); 
var user_routes = require('./routes/user'); 
var message_routes = require('./routes/message');

var app = express();

var server = require('http').createServer(app); 
var io = require('socket.io')(server);

io.on('connection', function(socket){
    console.log('Usuario conectado')
}); 

mongose.connect('mongodb://localhost:27017/twitterdb', (err)=> {
    if(err){
        throw err; 
    }else {
        console.log('Conectado a la base de datos'); 
        app.listen(port, function(){
            console.log("Conectado al puerto " + port); 
        })
    }
}); 

app.use(bodyparser.urlencoded({extended: true})); 
app.use(bodyparser.json()); 

app.use('/api', user_routes);
app.use('/api', message_routes);
module.exports = app; 

