const express = require("express");
const TagController = require("../../controllers/Tag");
const jwtAuth = require("../../middlewares/jwt");

const tagValidateRequest = require('../../middlewares/tagValidation');
const router = express.Router();

const tagController = new TagController();

router.post('/add/:blogId',jwtAuth,tagValidateRequest,tagController.add);
router.put('/edit/:blogId/:tagId',jwtAuth,tagValidateRequest,tagController.edit);

console.log("tag Router");
module.exports = router;