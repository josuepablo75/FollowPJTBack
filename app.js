var bodyparser = require('body-parser')
var mongoose = require('mongoose')
var port = process.env.port || 4201
var express = require('express')

var user_routes = require('./routes/user')
var messages_routes = require('./routes/message')

var app = express();
var server = require ('http').createServer(app)
var io = require('socket.io')(server)

io.on('connection',function(socket){
    socket.on('save-message',function(new_msm){
        io.emit('new-message',{message: new_msm})
    })
})

//DATABASE CONNECTION
mongoose.connect('mongodb://localhost:27017/twitterdb',(err)=> {
    if (err){
        throw err
    }
    else
    {
        console.log('Conectado a la DB')
        server.listen(port,function(){
            console.log('estas conectado al puerto:' + port)
        })
    }
})

app.use(bodyparser.urlencoded({extended: true}))
app.use(bodyparser.json())

app.use((req,res,next)=>{
    res.header('Content-Type: application/json')
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Access-Control-Allow-Request-Method')
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, OPTIONS')
    res.header('Allow','GET, PUT, POST, DELETE, OPTIONS')
    next()
})


app.use('/api', user_routes)
app.use('/api', messages_routes)

module.exports = app
