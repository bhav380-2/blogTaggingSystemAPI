const express = require("express");
const router = express.Router();

const blogValidation = require('../../middlewares/blogValidation');
const jwtAuth =require('../../middlewares/jwt');

const BlogController = require('../../controllers/blog');
const blogController = new BlogController();



// ______________________get requests___________________

// _______search and filter endpoint______
router.get('/search',blogController.searchByTags);
router.get('/filter',blogController.filter);


router.get('/getAll',blogController.getAll);
router.get('/get/:id',blogController.get);

// _____________________post request___________________
router.post('/add',jwtAuth,blogValidation,blogController.add)

// _____________________delete request_________________
router.delete('/delete/:id',jwtAuth,blogController.delete);

module.exports = router;


