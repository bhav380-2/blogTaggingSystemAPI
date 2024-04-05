const { Blog, User, Tag, sequelize } = require('../models');
const { Op } = require('sequelize');

module.exports = class BlogController {

    async add(req, res) {

        try {
            const { title, content } = req.body;

            const newBlog = await Blog.create({
                title: title,
                content: content,
                UserId: req.userId
            })

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


    async searchByTags(req, res) {


        try {
            const { tags } = req.query;

            if(!tags || tags.trim()==""){

                return res.status(400).send({
                    "success": false,
                    "content": {
                        "data": []
                    }
                })
            }

            let tagList = tags.split(',');
            
            let condition = '';

            tagList.map(t => {
                condition = condition + `'${t}',`
            })

          

            condition = condition.slice(0, condition.length - 1);

            

            const query = `
                select b.id from Blogs as b 
                Inner join ( BlogTags as bt Inner join Tags as t on t.id = bt.TagId) 
                on b.id = bt.BlogId and t.tagName in (${condition})
                Group By b.id
                having Count(b.id)= ${tagList.length};
          `;

            const bids = await sequelize.query(query, {
                // replacements: { tagList },
                type: sequelize.QueryTypes.SELECT
            }
            );

            // console.log(condition+"condition*******************************************************")
            console.log(bids,tagList.length,condition);


            let ids = bids.map(bid => {
                return bid.id;
            })

            if(ids.length==0){
                return res.status(404).send({
                    "success":false,
                    "message":"Blogs not found"
                })
            }

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

    async filter(req, res) {

        try {
            let { startDate, endDate, author, tags } = req.query;

            if((!startDate || !endDate) && (!author || author.trim()=='') && (!tags || tags.trim()=='')){
                return res.status(400).send({
                    "success":false,
                    "message": "must send alteast date , author or tags"
                })
            }

            const filterOptions = {};

            if (author) {

                const user = await User.findOne({ where: { name: author } });
                if(user){
                    filterOptions.UserId = user.id;

                }
            }

            if (startDate && endDate) {

                startDate = new Date(startDate);
                endDate = new Date(endDate);
                endDate.setHours(23, 59, 59, 999);
                console.log(startDate);
                filterOptions.createdAt = { [Op.between]: [startDate, endDate] };
            }

            if (tags) {

                const tagList = tags.split(',');
                let condition = '';

                tagList.map(t => {
                    condition = condition + `'${t}',`
                })

                condition = condition.slice(0, condition.length - 1);

                const query = `
                    select b.id from Blogs as b 
                    Inner join ( BlogTags as bt Inner join Tags as t on t.id = bt.TagId) 
                    on b.id = bt.BlogId and t.tagName in (${condition})
                    Group By b.id
                    having Count(b.id)= ${tagList.length};
              `;

                const bids = await sequelize.query(query, {
                    replacements: { tagList },
                    type: sequelize.QueryTypes.SELECT
                });

                let ids = bids.map(bid => {
                    return bid.id;
                })

                filterOptions.id = ids;
            }

           

            const blogs = await Blog.findAll({ where: filterOptions ,include:{model:Tag}});

            if(blogs.length==0){
                return res.status(404).send({
                    "success":false,
                    "message":"Blogs not found"
                })
            }

            res.status(200).send({
                "success":true,
                "content":{
                    "data":blogs
                }
            })


        } catch (err) {
            console.log(err);
            return res.status(500).send("Something went wrong");

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
                return res.status(400).send({
                    "success":false,
                    "message":"Unauthorized Request"
                }
                 
             );
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