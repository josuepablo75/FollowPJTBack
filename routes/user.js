var express = require('express'); 
var app = express.Router();
var UserController = require('../controllers/UserController');

app.post('/registrar', UserController.registrar);
app.post('/login', UserController.login);
app.get('/usuario/:id', UserController.get_user);
app.get('/usuarios', UserController.get_users);

module.exports = app; 