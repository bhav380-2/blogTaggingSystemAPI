const express = require("express");
const router = express.Router();


router.use('/blog',require('./blog'));  //redirects blog related req to blog.js file
router.use('/tag',require('./tag'));   //redirects tag related req to tag.js file
router.use('/auth',require('./user'));   //redirects auth related req to auth.js file

module.exports = router;


