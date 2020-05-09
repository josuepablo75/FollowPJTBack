var User= require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../helpers/jwt'); 
var path = require('path'); 
var userHelper = require('../helpers/userHelper'); 

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
    console.log('aca: ' + img)
    if(img != "null"){
        var path_img = './uploads/perfiles/'+img; 
        console.log(req.params)
        res.status(200).sendFile(path.resolve(path_img)); 
    }
    else
    {
        var path_img = './uploads/perfiles/default.png';
        res.status(200).sendFile(path.resolve(path_img));
    }
}
        
function editar_config(req,res){
    let id = req.params['id'];
    var data = req.body;
    if (req.files.imagen){
        //SI IMAGEN, SI CONTRASEÑA
        if(data.password){
                bcrypt.hash(data.password, null, null, function (err, hash) {
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
                console.log(imagen_path)
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
            bcrypt  .hash(data.password, null, null, function (err, hash) {
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

function seguir_usuario(req, res){
     let data = req.body;
     console.log(data);

     let follow = data.follow; 
     let seguidores = data.seguidores; 

     if (follow && seguidores)
    { 
        //SEGUIR A UN USUARIO
               User.findByIdAndUpdate(seguidores, {
                  $addToSet: {
                      follow: follow
                  }
               }, (err, user_update) => {
                   if (err) {
                       res.status(500).send({
                           message: 'Error en el servidor'
                       });
                   } else {
                       if (user_update) {
                           
                        //SEGUIDORES DE UN USUARIO
                          User.findByIdAndUpdate(follow, { $addToSet: {
                                  seguidores: seguidores }
                          }, (err, user_update) => {
                              if (err) {
                                  res.status(500).send({
                                      message: 'Error en el servidor'
                                  });
                              } 
                          })

                          res.status(200).send({
                              user: user_update
                          });

                       } else {
                           res.status(500).send({
                               message: 'No se pudo actualizar'
                           });
                       }
                   }
               })
    }
     else
    {
       res.status(500).send({
           message: 'No se puede realizar la accion faltan parametros'
       });
    }
}

function eliminar_follow(req, res) {
    let data = req.body;
    console.log(data);

    let follow = data.follow;
    let seguidores = data.seguidores;

    if (follow && seguidores) {
        //SEGUIR A UN USUARIO
        User.findByIdAndUpdate(seguidores, {
            $pull: {
                follow: follow
            }
        }, (err, user_update) => {
            if (err) {
                res.status(500).send({
                    message: 'Error en el servidor'
                });
            } else {
                if (user_update) {

                    //DEJAR DE SEGUIR A UN USUARIO
                    User.findByIdAndUpdate(follow, {
                        $pull: {
                            seguidores: seguidores
                        }
                    }, (err, user_update) => {
                        if (err) {
                            res.status(500).send({
                                message: 'Error en el servidor'
                            });
                        }
                    })
                    res.status(200).send({
                        user: user_update
                    });

                } else {
                    res.status(500).send({
                        message: 'No se pudo actualizar'
                    });
                }
            }
        })
    } else {
        res.status(500).send({
            message: 'No se puede realizar la accion faltan parametros'
        });
    }
}

async function listar_seguidos(req, res){
    let id = req.params['id'];
    
    let userseguido = await User.findById(id, {follow:true}); 

    userHelper.obtener_usuario(userseguido).then(users_follow => {
        res.status(200).send({
        users: users_follow
        });
    }).catch(err => {
        res.status(500).send({
        message: 'Error en el servidor'
        });
    });
}

async function listar_seguidores(req, res) {
    let id = req.params['id'];

    let userseguido = await User.findById(id, {
        seguidores: true
    });

    userHelper.obtener_usuario(userseguido).then(users_follow => {
        res.status(200).send({
            users: users_follow
        });
    }).catch(err => {
        res.status(500).send({
            message: 'Error en el servidor'
        });
    });
}


async function count_seguidos(req, res) {
    let id = req.params['id'];
    var cont = 0; 

    let userseguido = await User.findById(id, {
        follow: true
    });

    userHelper.count_follow(userseguido).then(count => {
        res.status(200).send({
            follows: count
        });
    }).catch(err => {
       res.status(500).send({
           message: 'Error en el servidor'
       });
    });
}

async function count_seguidores(req, res) {
    let id = req.params['id'];
    var cont = 0;

    let userseguido = await User.findById(id, {
        seguidores: true
    });

    userHelper.count_seguidores(userseguido).then(count => {
        res.status(200).send({
            seguidores: count
        });
    }).catch(err => {
       res.status(500).send({
           message: 'Error en el servidor'
       });
    });
}


module.exports = {
    registrar, 
    login, 
    get_user, 
    get_users, 
    activar_estado,
    desactivar_estado, 
    update_foto, 
    get_img,
    editar_config, 
    seguir_usuario, 
    eliminar_follow, 
    listar_seguidos, 
    listar_seguidores, 
    count_seguidos, 
    count_seguidores
}