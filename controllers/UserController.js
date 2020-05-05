var User= require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt'); 
var path = require('path'); 

function registrar(req,res){
    var params = req.body
    var user = new User(); 
    user.nombre = params.nombre; 
    user.email = params.email;
    user.imagen = null;
    user.telefono = ''
    user.bio = '';
    user.facebook = 'undefined';
    user.twitter = 'undefined';
    user.estado = false; 

    if(params.password){
        bcrypt.hash(params.password, null, null, function(err, hash){
            user.password = hash;
            User.findOne({email:params.email}, (err, user_data)=>{
                if(!user_data)
                {
                    user.save((err, user)=>{
                        if(user)
                        {
                            res.status(200).send({user:user});
                        }
                        else
                        {
                             res.status(404).send({message: err});
                        }
                    })
                }else
                {
                    res.status(404).send({message: 'El correo ya existe'});
                }
            })
        });
        
    }
    else 
    {
        res.status(500).send({message:'Ingrese la contraseña'}); 
    }
}

function login(req, res){
    var data = req.body;

    User.findOne({email: data.email}, (err, user_data)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }
        else
        {
            if(!user_data)
            {
                 res.status(404).send({message: 'El usuario no existe o no esta registrado'});
            }
            else
            {
                bcrypt.compare(data.password, user_data.password, function(err, check){
                    if(check){
                        if(data.gettoken){
                            res.status(200).send({
                                jwt: jwt.createToken(user_data), 
                                user: user_data, 
                            message: 'with token' });
                        } else
                        {
                            res.status(200).send({
                                jwt: jwt.createToken(user_data),
                                user: user_data,
                                message: 'no token'
                            });
                        }
                    }
                })

            }
        }
    })
}

function get_user(req, res){
    let id = req.params['id'];

    User.findById(id, (err, user)=>{
        if(err )
        {
            res.status(500).send({message: 'Error en el servidor'});
        }
        else
        {
            if(user){
                res.status(200).send({user:user});
            }
            else 
            {
                res.status(404).send({
                    message: 'No existe un usuario con ese id'
                });
            }
        }
    })
}

function get_users(req, res){
    User.find((err, users)=>{
        if(err)
        {
            res.status(500).send({message: 'Error en el servidor'});
        }
        else
        {
            if (users)
            {
                res.status(200).send({users:users});
            }
            else
            {
                res.status(404).send({message: 'No existe ingun usuario'});
            }
        } 

    })
}

function activar_estado(req, res){
    let id = req.params['id'];
    
    User.findByIdAndUpdate(id, {estado: true}, (err, user_update)=>{
        if(err){
            res.status(500).send({message:'Error en el servidor'});
        }
        else
        {
            if(user_update){
                res.status(200).send({user:user_update});
            }
            else
            {
                res.status(500).send({message: 'No se pudo actualizar el estado'});
            }
        }
    })
}

function desactivar_estado(req, res) {
    let id = req.params['id'];

    User.findByIdAndUpdate(id, { estado: false }, (err, user_update) => {
        if (err) {
            res.status(500).send({
                message: 'Error en el servidor'
            });
        } else {
            if (user_update) {
                res.status(200).send({
                    user: user_update
                });
            } else {
                res.status(500).send({
                    message: 'No se pudo actualizar el estado'
                });
            }
        }
    })
}

function update_foto(req, res){
    let id = req.params['id']; 
    if(req.files.imagen){
        let image_path = req.files.imagen.path;
        let name = image_path.split('\\');
        let imagen_name= name[2]; 

        User.findByIdAndUpdate(id,{imagen: imagen_name}, (err, user_update)=>{
            if(err){
                res.status(500).send({message: 'Error en el servidor'});
            }
            else
            {
                if(user_update)
                {
                    res.status(200).send({
                        user: user_update
                    });
                }
                else
                {
                    res.status(500).send({
                        message: 'No se encontro el usuario'
                    });
                }
            }
        })
    }
    else
    {
        res.status(404).send({
            message: 'Seleccione una imagen'
        });
    }
}

function get_img(req, res){
    var img = req.params['img']; 

    if(img != "null"){
        var path_img = './uploads/perfiles/'+img; 
        res.status(200).sendFile(path.resolve(path_img)); 
    }
    else
    {
        var path_img = './uploads/perfiles/default.png';
        res.status(200).sendFile(path.resolve(path_img));
    }
}

module.exports = {
    registrar, 
    login, 
    get_user, 
    get_users, 
    activar_estado,
    desactivar_estado, 
    update_foto, 
    get_img
}