const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({

    tagName : {
        type:String,
        required:true
    },

    blogs :[{
        type: mongoose.Types.ObjectId,
        ref : 'Blogs'
    }]

},{
    timestamps:true
})

const Tags = mongoose.model('Tags',tagSchema);
module.exports = Tags;