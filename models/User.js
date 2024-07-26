const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name :{
        type: String,
        required:true
    },
    email : {
        type : String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role : {
        type: String,
        enum : ["admin","user"],
        default : "user"
    },

    blogs:[{
        type: mongoose.Types.ObjectId,
        ref : "Blog"
    }],
},{
    timestamps: true
})



const Users = mongoose.model("Users",userSchema);
module.exports = Users;