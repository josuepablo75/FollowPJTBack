var User= require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt'); 

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

function editar_config(req,res){
    let id = req.params['id'];
    var data = req.body;

    if (req.files){
        //SI IMAGEN, SI CONTRASEÑA
        if(data.password){
                Bcrypt.hash(data.password,null,null,function(err,hash){
                let imagen_path = req.files.imagen.path;
                let name = imagen_path.split('\\');
                let imagen_name = name[2];
                if(err){
                    res.status(500).send({
                        message: 'Error en el servidor.'
                    });
                }else{
                    User.findByIdAndUpdate(id,{
                        nombre: data.nombre,
                        password: hash,
                        imagen: imagen_name,
                        telefono: data.telefono,
                        bio: data.bio,
                        facebook: data.facebook,
                        twitter: data.twitter,
                        estado: data.estado
                    },(err,user_data)=>{
                        if(user_data){
                            res.status(200).send({user:user_data});
                        }
                    })
                }
            })
        }else{
            //SI IMAGEN, NO CONTRASEÑA
                let imagen_path = req.files.imagen.path;
                let name = imagen_path.split('\\');
                let imagen_name = name[2];
                    User.findByIdAndUpdate(id,{
                        nombre: data.nombre,
                        imagen: imagen_name,
                        telefono: data.telefono,
                        bio: data.bio,
                        facebook: data.facebook,
                        twitter: data.twitter,
                        estado: data.estado
                    },(err,user_data)=>{
                        if(user_data){
                            res.status(200).send({user:user_data});
                        }
                    })
        }
    }else{
        //SI CONTRASEÑA, NO IMAGEN
        if(data.password){
            Bcrypt.hash(data.password,null,null,function(err,hash){
                if(err){
                    res.status(500).send({
                        message: 'Error en el servidor.'
                    });
                }else{
                    User.findByIdAndUpdate(id,{
                        nombre: data.nombre,
                        password: hash,
                        telefono: data.telefono,
                        bio: data.bio,
                        facebook: data.facebook,
                        twitter: data.twitter,
                        estado: data.estado
                    },(err,user_data)=>{
                        if(user_data){
                            res.status(200).send({user:user_data});
                        }
                    });
                }
            })
        }else{
            //NO CONTRASEÑA, NO IMAGEN
                    User.findByIdAndUpdate(id,{
                        nombre: data.nombre,
                        telefono: data.telefono,
                        bio: data.bio,
                        facebook: data.facebook,
                        twitter: data.twitter,
                        estado: data.estado
                    },(err,user_data)=>{
                        if(user_data){
                            res.status(200).send({user:user_data});
                        }
                    })
        }
    }
}

module.exports = {
    registrar, 
    login, 
    get_user, 
    get_users,
    editar_config
}