const mongoose = require("mongoose");
const { Schema } = require("../db/conn")

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    img:{
        data : Buffer,
        contentType : String
    }
   
});

module.exports = mongoose.model("userimg",userSchema);