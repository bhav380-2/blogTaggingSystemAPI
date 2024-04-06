const express = require("express");
const router = express.Router();

// redirect v1 req to index.js file int v1 directory
router.use('/v1',require('./v1'));

module.exports = router;


