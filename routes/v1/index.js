const express = require("express");
const router = express.Router();


router.use('/post',require('./post'));
router.use('/tag',require('./tag'));




console.log("index Router");
module.exports = router;


