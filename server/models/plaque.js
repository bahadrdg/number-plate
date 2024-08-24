const mongoose = require('mongoose')

const plaqueSchema = new mongoose.Schema({
    plaqueName : {type : String, trim : true, required : true, unique : true},
    foundLocation : {type : [String]},
    dateAndClock : {type : [String]}
})

const Plaque = mongoose.model('Plaque', plaqueSchema)
module.exports = Plaque