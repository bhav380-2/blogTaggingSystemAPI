const { Blog, User, Tag } = require('../models');

module.exports = class BlogController {

    async add(req, res) {

        try {
            const { title, content } = req.body;

            const newBlog = await Blog.create({
                title: title,
                content: content,
                UserId: req.userId
            } )


            //_________lazy loading user______________
            const user = await newBlog.getUser({ attributes: { exclude: ['password'] } });

            return res.status(201).send({
                "success": true,
                "content": {
                    "data": {
                        ...newBlog.dataValues,
                        "author": user
                    }
                }
            })

        } catch (err) {
            console.log(err)
            return;
        }
    }



    async getAll(req, res) {

        try {

            const blogs = await Blog.findAll({
                attributes: {
                    exclude: ['UserId']
                },
                include: [
                    {
                        model: User,
                        attributes: {
                            exclude: ['password']
                        }
                    },

                    {
                        model: Tag
                    }
                ]
            });

            return res.status(200).send({
                "success": true,
                "content": {
                    "data": blogs
                }

            });

        } catch (err) {

            console.log(err);
            return res.status(500).send("Something went wrong")
        }
    }


    async get(req, res) {


        try {

            const blogId = req.params.id;

            const blog = await Blog.findOne({
                where: {
                    id: blogId
                },
                attributes: {
                    exclude: ['UserId']
                },
                include: [

                    {
                        model: User,
                        attributes: {
                            exclude: ['password']
                        }
                    },

                    {
                        model: Tag
                    }
                ]
            });

            return res.status(200).send({
                "success": true,
                "content": {
                    "data": blog
                }

            })

        } catch (err) {
            console.log(err);
            return res.status(500).send("Something went wrong")
        }
    }


    async delete(req, res) {

        try {

            const blogId = req.params.id;
            const blog = await Blog.findOne({ where: { id: blogId } });
            const user = await User.findOne({ where: { id: req.userId }, attributes: { exclude: ['password'] } });


            if (user.role != 'admin' && blog.UserId != req.userId) {
                // ********************check unauthorized status code**********************************************************
                return res.status(400).send("UnAuthorized Request");
            } else {

                await Blog.destroy({ where: { id: blogId } });

                return res.status(201).send({
                    "success": true
                })
            }

        } catch (err) {
            console.log(err);
            return res.status(500).send("Something went wrong")

        }
    }
}




// __________eager loading__________________________

// const result = await Blog.findOne({
//     where: {
//         id: newBlog.id
//     },
//     include: User
// })
