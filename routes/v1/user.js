const express = require("express");
const router = express.Router();

const userValidateRequest = require('../../middlewares/userValidation');
const UserController = require('../../controllers/User');
const userController = new UserController();

// ________________post requests_________________
router.post('/signup',userValidateRequest,userController.signup);
router.post('/signin',userController.signin);

module.exports = router;


