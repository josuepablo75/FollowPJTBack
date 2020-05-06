var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var UserSchema = Schema({
    nombre: String, 
    email: String, 
    password: String, 
    imagen: String, 
    telefono: String, 
    bio: String, 
    facebook: String, 
    twitter: String, 
    estado: Boolean, 
    follow: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    seguidores: [{
         type: Schema.Types.ObjectId,
         ref: 'user'
    }] 
});

module.exports = mongoose.model('user', UserSchema); 
