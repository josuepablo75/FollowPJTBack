var User = require('../models/user');


async function obtener_usuario(users) {
    let array_users = [];
    for (let user_id of users.follow || users.seguidores ) {
        try {
            let found = await User.findById(user_id).exec();
            array_users.push(found);
        } catch (e) {
            console.log('No existe en la base de datos o fue eliminado');
        }
    }
    return array_users;
}


module.exports = {
    obtener_usuario
}