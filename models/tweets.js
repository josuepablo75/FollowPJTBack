var mongoose = require('mongoose')
var schema = mongoose.Schema

var TweetSchema = schema({

    texto: String,
    //imagen: String,
    user: { type: schema.ObjectId, ref: 'user'},
    createAt: { type: Date, default: Date.now}
})

module.exports = mongoose.model('tweets', TweetSchema)