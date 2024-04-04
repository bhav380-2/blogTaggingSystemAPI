const express = require("express");
const router = express.Router();


router.get('/',(req,res)=>{
    res.send("handling post routes");
})



console.log("Post Router");
module.exports = router;


