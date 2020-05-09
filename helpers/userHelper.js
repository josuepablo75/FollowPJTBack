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

async function count_follow(users) {
    var cont = 0; 
    for (let user_id of users.follow ) {
        cont++;
    }
    return cont;
}

async function count_seguidores(users) {
    var cont = 0;
    for (let user_id of users.seguidores) {
        cont++;
    }
    return cont;
}

module.exports = {
    obtener_usuario, 
    count_follow, 
    count_seguidores
}