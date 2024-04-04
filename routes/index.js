const express = require("express");
const router = express.Router();

router.use('/v1',require('./v1'));

console.log("index Router");
module.exports = router;


