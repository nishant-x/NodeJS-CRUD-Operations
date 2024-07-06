const mongoose = require("mongoose");
const { Schema } = require("../db/conn")

const userSchema = mongoose.Schema({
    
    imgurl: String,
    name: String,
    email: String,
   
});

module.exports = mongoose.model("user",userSchema);


