var jwt = require('jwt-simple'); 
var moment = require('moment');
var secret = 'PJT'; 

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        nombre: user.nombre, 
        email: user.email, 
        telefono: user.telefono, 
        bio: user.bio, 
        facebook: user.facebook, 
        imagen: user.imagen, 
        estado: user.estado, 
        iat: moment().unix(), 
        exp: moment().add(30, 'days').unix, 
    }

    return jwt.encode(payload, secret); 
};