const express = require("express");
const db = require("./models");

const {Tag}= require('./models');
const {Blog} = require('./models');
const {BlogTag} = require('./models');
const {User} = require('./models');

// 1 to Many association between User and blog
User.hasMany(Blog);
Blog.belongsTo(User);

// Many to Many association between Blog and Tag
Blog.belongsToMany(Tag,{through:BlogTag});
Tag.belongsToMany(Blog,{through:BlogTag});

const app = express();
const PORT = 5000;

// Parsing json data
app.use(express.json());

// redirecting to routes index.js file
app.use('/api',require('./routes'));

// Handling wrong api endpoints
app.use((req,res)=>{
    res.status(404).send('API NOT FOUND !!!');
 })
 
// syncing mysql db using sequelize
db.sequelize.sync().then((req) => {


    // firing express server
    app.listen(PORT, (err) => {
        if (err) {
            console.log("Error while listening to port ", PORT, " ::: ", err);
            return;
        }

        console.log("server is successfully running on port ", PORT);
    })

})


// exporting app (used for unit testing)
module.exports = app;



