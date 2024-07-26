// _______imports________
// const { Blog, User, Tag, sequelize } = require('../models');
// const { Op } = require('sequelize');

const Blogs = require('../models/Blog');
const Users = require('../models/User');
const Tags = require('../models/Tag');


// ________ Blog controller__________
module.exports = class BlogController {

    // ___________________search by tags _______________________
    async searchByTags(req, res) {

        try {
            let { tags } = req.query;
            // if tags are not sent in request, return response with status code 400
            if (!tags || tags.trim() == "") {
                return res.status(400).send({
                    "success": false,
                    "content": {
                        "data": []
                    }
                })
            }

            // split tags using ',' and stored returned array in tagList
            let tagList = tags.split(',');

            // __________________technique 1 -- using Blogs model and populate_____________________
            // let blogs = await Blogs.find().populate('tags');
            // blogs =  blogs.filter((blog)=>{
            //     return blog.tags.some(t=>tagList.includes(t.tagName))
            // })

            // __________________technique 2 -- using tags and blogs model
            tags = await Tags.find({tagName : {$in : tagList}});
            let tagIds = tags.map(t=>t._id);
            const blogs= await Blogs.find({tags : {$in : tagIds}});

            // ________________technique 3 -- using Tags model and Set
            // tags = await Tags.find({tagName : {$in : tagList}}).populate('blogs');
            // const blogs = new Set();
            // tags.forEach(async (t)=>{
            //     await t.blogs.forEach( (b)=>{
            //         blogs.add(b);
            //     })
            // })
            // blogs = Array.from(blogs);


            // return blogs with success status code 200
            return res.status(200).send({
                "success": true,
                "content": {
                    "data": blogs
                }
            })

        } catch (err) {
            console.log(err);
            return res.status(500).send("Something went wrong");
        }
    }

    // ________________filter blogs using date,author,tags_______________________
    async filter(req, res) {

        try {
            let { startDate, endDate, author, tags } = req.query;

            // if data , author and tags, none of them are passed return with status code 400 and error message 
            if ((!startDate || !endDate) && (!author || author.trim() == '') && (!tags || tags.trim() == '')) {
                return res.status(400).send({
                    "success": false,
                    "message": "must send alteast date , author or tags"
                })
            }

            const filterOptions = {}; // used to store all filter options

            let user;
            // if author is passed in req
            if (author) {

                //finds author
                user = await Users.findOne({ name: author });

                // if author found
                if (user) {
                    filterOptions.author = user._id;
                } else {

                    return res.status(404).send({
                        "success": false,
                        "message": "Blogs not found"
                    })
                }
            }

            // if date is passed in req
            if (startDate && endDate) {

                // convert date to suitable format
                startDate = new Date(startDate);
                endDate = new Date(endDate);
                endDate.setHours(23, 59, 59, 999);

                // stores date filter in filterOptions
                filterOptions.createdAt = {
                    $gte: startDate,
                    $lt: endDate,
                }
            }

            // if tags were passed in req
            if (tags) {

                // split tags using ',' and stored returned array in tagList
                const tagList = tags.split(',');
                tags = await Tags.find({tagName : {$in : tagList}});
                const tagIds = tags.map(t=>t._id);
                filterOptions.$or = [{ tags: { $in: tagIds } }]
            }



            // find blogs using filterOptions
            const blogs = await Blogs.find({}).where(filterOptions);

            // if blogs not found , return with 404 status code
            if (blogs.length == 0) {
                return res.status(404).send({
                    "success": false,
                    "message": "Blogs not found"
                })
            }
            //  if blogs found , after applying filterOptions
            // return res with 200 status code and blogs 
            return res.status(200).send({
                "success": true,
                "content": {
                    "data": blogs
                }
            })

        } catch (err) {
            return res.status(500).send("Something went wrong");
        }
    }


    // ________________add blog __________________
    async add(req, res) {

        try {
            const { title, content } = req.body;
            const newBlog = await Blogs.create({
                title: title,
                content: content,
                author: req.userId
            })

            const author = await Users.findById(req.userId).select('name email blogs');
            author.blogs.push(newBlog.id);
            await author.save();
            newBlog.author = author;

            // returns newBlog data 
            return res.status(201).send({
                "success": true,
                "content": {
                    "data": newBlog
                }
            })

        } catch (err) {
            console.log(err);
            return res.status(500).send("Something went wrong");
        }
    }

    // _____________________get all Blogs _______________________________-
    async getAll(req, res) {

        try {

            // finds all blogs
            const blogs = await Blogs.find({}).populate({ path: "author", select: 'name email' }).populate({ path: 'tags' });

            // return blogs with status code 200
            return res.status(200).send({
                "success": true,
                "content": {
                    "data": blogs
                }

            });

        } catch (err) {

            return res.status(500).send("Something went wrong")
        }
    }

    // _____________________get blog using blogId____________________
    async get(req, res) {

        try {

            const blogId = req.params.id;

            // finds blog using blogId
            const blog = await Blogs.findById(blogId).populate({ path: 'author', select: 'name email' }).populate({ path: 'tags' });

            // if blog not found return response with status code 404
            if (!blog) {
                return res.status(404).send({
                    "success": false,
                    "message": "Blog not Found"
                })
            }

            // if blog found
            // returns with status code 200
            return res.status(200).send({
                "success": true,
                "content": {
                    "data": blog
                }

            })

        } catch (err) {
            return res.status(500).send("Something went wrong")
        }
    }


    async delete(req, res) {

        try {
            const blogId = req.params.id;

            // finds blog by blogId
            const blog = await Blogs.findById(blogId);

            // finds user by userId
            const user = await Users.findById(req.userId).select('-password');

            // handles unauthorized request
            if (user.role != 'admin' && blog.author != req.userId) {

                return res.status(401).send({
                    "success": false,
                    "message": "Unauthorized request"
                });
            }

            let blogAuthor;

            if (user.role == 'admin' && blog.author != req.userId) {
                blogAuthor = await Users.findById(blog.author);
            } else {
                blogAuthor = user;
            }

            blogAuthor.blogs = blogAuthor.blogs.filter((blog) => {
                return blog._id != blogId
            })


            await blogAuthor.save();

            await blog.deleteOne();

            // return response with status code 201
            return res.status(200).send({
                "success": true
            })

        } catch (err) {
            console.log(err);
            return res.status(500).send("Something went wrong")
        }
    }
}