const express = require("express");

const jwtAuth = require("../../middlewares/jwt");
const tagValidateRequest = require('../../middlewares/tagValidation');

const TagController = require("../../controllers/Tag");
const tagController = new TagController();

const router = express.Router();

// ______________post request___________________
router.post('/add/:blogId',jwtAuth,tagValidateRequest,tagController.add);

// ______________put request____________________
router.put('/edit/:blogId/:tagId',jwtAuth,tagValidateRequest,tagController.edit);

// _____________delete request___________________
router.delete('/delete/:blogId/:tagId',jwtAuth,tagController.delete);

module.exports = router;