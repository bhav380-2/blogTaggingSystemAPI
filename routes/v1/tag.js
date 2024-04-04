const express = require("express");
const router = express.Router();

router.get('/',(req,res)=>{
    res.send("handling tag routes");
})


console.log("tag Router");
module.exports = router;