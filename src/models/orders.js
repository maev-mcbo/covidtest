const mongoose = require('mongoose')
const {Schema} = mongoose

const ordersSchema = new Schema({
    fname:{
        type: String,
        require: true
    },
    lname:{
        type: String,
        require: true
    },
    personalID:{ type: String,
        require: true},

    phone:{
        type: String,
        require: true
    },
    gender:{
        type: String,
        require: true
    },
    mail:{
        type: String,
        require: true
    },
    passport:{
        type: String,
        require: true
    },
    bornCountr:{ type: String,
        require: true},
    address:{ type: String,
        require: true},
    testtype:{ type: String,
        require: true},
    originF:{ type: String,
        require: true},
    destf:{ type: String,
        require: true},
    airline:{ type: String,
        require: true},
    idf:{ type: String,
        require: true},
    departuredate:{ type: String,
        require: true},
    arrivaldate:{ type: String,
        require: true},

}, {
    timestamps: true
})

const Order = mongoose.model('order', ordersSchema);
module.exports = Order