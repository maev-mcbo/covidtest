const mongoose = require('mongoose')
const {Schema} = mongoose

const usersSchema = new Schema({
    fname:{
        type: String,
    },
    lname:{
        type: String,
    },
    bdate:{
        type: String,
    },
    mail:{
        type: String,
    },
    passport:{
        type: String,
    },
    createAt:{
        type: String
    }
})

const User = mongoose.model('User', usersSchema);
module.exports = User