const express = require("express");
const router = express.Router();

const {Tag,Blog,User} =require('../models');



// redirect v1 req to index.js file int v1 directory
router.use('/v1',require('./v1'));

// router.get('/v2/:tagname',async (req,res)=>{

//     console.log(req.params);

//    const tag =  await Tag.findOne({ where: { tagName: req.params.tagname } })
//     console.log(tag);



//     return res.send({"data ": tag});

// })

module.exports = router;




