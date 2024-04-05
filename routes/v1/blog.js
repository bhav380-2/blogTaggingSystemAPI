const express = require("express");
const router = express.Router();

const blogValidation = require('../../middlewares/blogValidation');

const jwtAuth =require('../../middlewares/jwt');

const BlogController = require('../../controllers/blog');

const blogController = new BlogController();



router.post('/add',jwtAuth,blogValidation,blogController.add)

router.get('/getAll',blogController.getAll);

router.get('/get/:id',blogController.get);

router.delete('/delete/:id',jwtAuth,blogController.delete);

router.get('/search',blogController.searchByTags);

router.get('/filter',blogController.filter);



console.log("Blog Router");
module.exports = router;


