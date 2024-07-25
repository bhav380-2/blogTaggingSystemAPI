const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({

    title : {
        type : String,
        required:true
    },

    content:{
        type : String,
        required:true
    },

    author : {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Users"
    },

    tags:[{
        type: mongoose.Types.ObjectId,
        ref : "Tags"
    }]
},{
    timestamps:true
})

const Blogs = mongoose.model('Blogs',blogSchema);
module.exports = Blogs;