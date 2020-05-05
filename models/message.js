var mongoose = require('mongoose')
var schema = mongoose.Schema

var MessageSchema = schema ({
    de: {type: schema.ObjectId, ref: 'user'},
    para: {type: schema.ObjectId, ref: 'user'},
    msn: String,
    createAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model('message',MessageSchema)