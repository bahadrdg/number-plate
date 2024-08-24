const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name : {type : String, trim : true, required : true},
    lastname : {type : String, trim : true, required : true},
    email : {type : String, trim : true, required : true, unique : true },
    password : {type : String, trim : true, required : true},
    reset : {
        code : {type : String, default : null},
        time : {type : Date, default : null}
    }

}, {collection : "users", timestamps:true})

const Users = mongoose.model('users', userSchema)
module.exports = Users