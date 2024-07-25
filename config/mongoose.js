const mongoose = require('mongoose');

const connectToMongodb = async()=>{
    const url = 'mongodb://127.0.0.1:27017/blogTaggingSystem'
    try{
      await  mongoose.connect(url);
      console.log("Successfully Connected to mongodb");

    }catch(err){
        console.log("Error while connecting to mongodb ::: ",err);
    }
}

module.exports = connectToMongodb;