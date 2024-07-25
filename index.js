const express = require("express");
const connectToMongodb = require("./config/mongoose");

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
 

app.listen(PORT, (err) => {
    if (err) {
        console.log("Error while listening to port ", PORT, " ::: ", err);
        return;
    }
    console.log("server is successfully running on port ", PORT);
    connectToMongodb();
})

// exporting app (used for unit testing)
module.exports = app;