const express = require("express");



const db = require("./models");


const {Tag}= require('./models');
const {Blog} = require('./models');
const {BlogTag} = require('./models');
const {User} = require('./models');


// foreignKey: "tutorialId",
//   as: "tutorial",

User.hasMany(Blog);
Blog.belongsTo(User);


Blog.belongsToMany(Tag,{through:BlogTag});
Tag.belongsToMany(Blog,{through:BlogTag});

console.log("********************************************");
console.log("____________________________________________________")


const app = express();
const PORT = 5000;


app.use(express.json());



app.use('/api',require('./routes'));

app.use((req,res)=>{
    res.status(404).send('API NOT FOUND !!!');
 })
 

db.sequelize.sync().then((req) => {


    app.listen(PORT, (err) => {
        if (err) {
            console.log("Error while listening to port ", PORT, " ::: ", err);
            return;
        }

        console.log("server is successfully running on port ", PORT);
    })

})

module.exports = app;



