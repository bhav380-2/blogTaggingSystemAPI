const express = require("express");
const router = express.Router();


const UserController = require('../../controllers/User');

const userController = new UserController();


router.use('/blog',require('./blog'));
router.use('/tag',require('./tag'));

router.use('/auth',require('./user'));





console.log("index Router");
module.exports = router;


