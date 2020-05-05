var express = require('express'); 
var app = express.Router();
var UserController = require('../controllers/UserController');
var muliparty = require('connect-multiparty'); 
var path = muliparty({uploadDir: './uploads/perfiles'});

app.post('/registrar', UserController.registrar);
app.post('/login', UserController.login);
app.get('/usuario/:id', UserController.get_user);
app.get('/usuarios', UserController.get_users);
app.put('/usuario/activar/:id', UserController.activar_estado);
app.put('/usuario/desactivar/:id', UserController.desactivar_estado);
app.put('/usuario/editar/imagen/:id', path, UserController.update_foto); 
app.get('/usuario/img/:img', UserController.get_img);

module.exports = app; 