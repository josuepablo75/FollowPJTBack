# FollowPJTBack
FollowPJT Backend

Routes 

Users 


post('/registrar')                Registrar usuario: este servicio se utiliza para registar un usuario en la plataforma 
post('/login')                    Iniciar sesion: con este servicio el usuario inicia sesion mediante correo y password
get('/usuario/:id')               Obtener usuario por id 
get('/usuarios')                  Obtener a todos los usuarios registrados 
put('/usuario/activar/:id')       Activar estado del usuario 
put('/usuario/desactivar/:id')    Desactivar el estado del usuario 
put('/usuario/editar/imagen/:id') Upload imagen y actualizar imagen de perfil de usuario 
get('/usuario/img/:img')          Obtener foto de perfil de usuario
post('/usuario/editar/:id')       Editar la informacion del usuario 
post('/usuario/seguir')           Seguir a un otro usuario por ejemplo Juan sigue a Pedro 
post('/usuario/dejardeseguir')    Dejar de seguir a un usuario
get('/usuario/seguidos/:id')      Obtener a todos los usuario a quienes sigo 
get('/usuario/seguidores/:id')    Obtener a todos mis seguidores 

Message

post('/mensaje/enviar' )          Enviar un mensaje a otro usuario
get('/mensajes/:de/:para')        Obtener conversacion entre dos usuarios 

Tweets 

post('/tweet/publicar')           Realizar publicacion tweet
put('/tweet/editar/:id')          Editar tweet
post('/tweet/eliminar/:id')       Eliminar tweet
get('/tweet/get_tweets/:id')      Obtener todas mis publicaciones
get('/tweet/tweets_seguidos/:id') Pagina inicial en la cual se obtienen todas mis publicaciones y las publicaciones de los usuarios
                                  a quienes sigo, tipo facebook. 

