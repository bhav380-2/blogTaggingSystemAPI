// _______imports________
const { Blog, User, Tag, sequelize } = require('../models');
const { Op } = require('sequelize');


// ________ Blog controller__________
module.exports = class BlogController {

    // ___________________search by tags _______________________
    async searchByTags(req, res) {

        try {
            const { tags } = req.query;

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

            let list = ""; // list variable is used in writing sql query , it stores tags in format: " 'tag1','tag2', ...etc"

            // iterating on each tag and storing tags inside list in format : " 'tag1','tag2', ...etc"
            tagList.map(t => {
                list = list + `'${t}',`
            })

            // removing last ',' from list
            list = list.slice(0, list.length - 1);

            // sql query
            const query = `
                select b.id from Blogs as b 
                Inner join ( BlogTags as bt Inner join Tags as t on t.id = bt.TagId) 
                on b.id = bt.BlogId and t.tagName in (${list})
                Group By b.id
                having Count(b.id)= ${tagList.length};
          `;

            //   using query to generate blog ids of blogs which contains all the tags sent in request 
            const bids = await sequelize.query(query, {
                // replacements: { tagList },
                type: sequelize.QueryTypes.SELECT
            }
            );

            // bids is in form of object , extracting all ids from bids and storing them inside ids array
            let ids = bids.map(bid => {
                return bid.id;
            })

            // if ids is empty , no blog was found have all the tags passed in request
            // returning with status code 404
            if (ids.length == 0) {
                return res.status(404).send({
                    "success": false,
                    "message": "Blogs not found"
                })
            }

            // finds blogs whose id matches with id in ids array
            const blogs = await Blog.findAll({
                where: {
                    id: {
                        [Op.in]: ids
                    }
                },
                include: [
                    {
                        model: Tag,
                    }
                ]
            })


            // return blogs with success status code 200
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

            let user
            // if author is passed in req
            if (author) {

                //finds author in Users table
                 user = await User.findOne({ where: { name: author } });

                // if author present in Users table stores id of author in filteredOptions
                if (user) {
                    filterOptions.UserId = user.id;
                }
            }

            // if date is passed in req
            if (startDate && endDate) {

                // convert date to suitable format
                startDate = new Date(startDate);
                endDate = new Date(endDate);
                endDate.setHours(23, 59, 59, 999);

                // stores date filter in filterOptions
                filterOptions.createdAt = { [Op.between]: [startDate, endDate] };
            }

            // if tags were passed in req
            if (tags) {

                // split tags using ',' and stored returned array in tagList
                const tagList = tags.split(',');

                let list = '';   // list variable is used in writing sql query , it stores tags in format: " 'tag1','tag2', ...etc"

                // iterating on each tag and storing tags inside list in format : " 'tag1','tag2', ...etc"
                tagList.map(t => {
                    list = list + `'${t}',`
                })

                // removing last ',' from list
                list = list.slice(0, list.length - 1);

                // sql query
                const query = `
                    select b.id from Blogs as b 
                    Inner join ( BlogTags as bt Inner join Tags as t on t.id = bt.TagId) 
                    on b.id = bt.BlogId and t.tagName in (${list})
                    Group By b.id
                    having Count(b.id)= ${tagList.length};
              `;

                //   using query to generate blog ids of blogs which contains all the tags sent in request 
                const bids = await sequelize.query(query, {
                    replacements: { tagList },
                    type: sequelize.QueryTypes.SELECT
                });

                // bids is in form of object , extracting all ids from bids and storing them inside ids array
                let ids = bids.map(bid => {
                    return bid.id;
                })

                // if ids array is not empty, store ids array in filterOptions
                if (ids.length != 0) {
                    filterOptions.id = ids;
                }
            }

            if(!filterOptions.UserId || !filterOptions.id){
                return res.status(404).send({
                    "success": false,
                    "message": "Blogs not found"
                })
            }

            // find blogs using filterOptions
            const blogs = await Blog.findAll({ where: filterOptions, include: { model: Tag } });

            // if blogs not found , return with 404 status code
            if (blogs.length == 0 ) {
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

            // creates new blog
            const newBlog = await Blog.create({
                title: title,
                content: content,
                UserId: req.userId
            })

            // gets author data
            const author = await newBlog.getUser({ attributes: { exclude: ['password'] } });

            // returns newBlog data and author data inside response
            return res.status(201).send({
                "success": true,
                "content": {
                    "data": {
                        ...newBlog.dataValues,
                        "author": author
                    }
                }
            })

        } catch (err) {
            return res.status(500).send("Something went wrong");
        }
    }

    // _____________________get all Blogs _______________________________-
    async getAll(req, res) {

        try {

            // finds all blogs
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
            const blog = await Blog.findOne({ where: { id: blogId } });

            // finds user by userId
            const user = await User.findOne({ where: { id: req.userId }, attributes: { exclude: ['password'] } });

            // handles unauthorized request
            if (user.role != 'admin' && blog.UserId != req.userId) {

                return res.status(401).send({
                    "success": false,
                    "message": "Unauthorized request"
                });
            }

            // if user is admin or blog belongs to logged in user

            // deletes the blog 
            await Blog.destroy({ where: { id: blogId } });

            // return response with status code 201
            return res.status(200).send({
                "success": true
            })

        } catch (err) {
            return res.status(500).send("Something went wrong")
        }
    }
}

















//  SELECT `Blog`.`id`, COUNT(`Tag`.`id`) AS `tagCount`, `Tags->BlogTag`.`id` AS `Tags.BlogTag.id`, `Tags->BlogTag`.`createdAt` AS `Tags.BlogTag.createdAt`, `Tags->BlogTag`.`updatedAt` AS `Tags.BlogTag.updatedAt`, `Tags->BlogTag`.`BlogId` AS `Tags.BlogTag.BlogId`, `Tags->BlogTag`.`TagId` AS `Tags.BlogTag.TagId` FROM `Blogs` AS `Blog` INNER JOIN ( `BlogTags` AS `Tags->BlogTag` INNER JOIN `Tags` AS `Tags` ON `Tags`.`id` = `Tags->BlogTag`.`TagId`) ON `Blog`.`id` = `Tags->BlogTag`.`BlogId` AND `Tags`.`tagName` IN ('COC', 'h33', 'x') GROUP BY `id` HAVING `tagCount` = 3;






// select b.id,Count(b.id) from Blogs as b 
// Inner join ( BlogTags as bt Inner join Tags as t on t.id = bt.TagId) 
//  on b.id = bt.BlogId and t.tagName in tagList
//   Group By b.id
// // having Count(b.id)= tagList.length




// const blogs = await Blog.findAll({
//     include:[{
//         model:Tag,
//         where:{tagName:{[Op.in]:tagList}},
//         attributes:[]
//     }]
//     , attributes: ['id', [sequelize.fn('COUNT', sequelize.col('Tag.id')), 'tagCount']],
//     group: ['Blog.id'], // Group by post id to ensure distinct posts
//     having: sequelize.where( sequelize.col('tagCount'), '=', tagList.length)
// })