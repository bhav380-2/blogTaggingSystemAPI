const express = require("express");
const router = express.Router();

const userValidateRequest = require('../../middlewares/userValidation');

const UserController = require('../../controllers/User');

const userController = new UserController();


router.post('/signup',userValidateRequest,userController.signup);

router.post('/signin',userController.signin);


console.log("auth Router");
module.exports = router;


