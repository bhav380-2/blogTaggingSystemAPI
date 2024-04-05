const { Blog, Tag, User, BlogTag } = require('../models');

module.exports = class TagController {
    async add(req, res) {

        try {

            const blogId = req.params.blogId;
            const userId = req.userId;
            const tagName = req.body.tagName;


            const blog = await Blog.findOne({ where: { id: blogId, UserId: userId } })

            if (!blog) {
                return res.status(400).send({
                    "success": false,
                    "message": "Unauthorized request"
                })
            }

            let tag = await Tag.findOne({ where: { tagName: tagName } });

            if (!tag) {
                tag = await Tag.create({
                    tagName: tagName
                })
            }

            const alreadyAttached = await BlogTag.findOne({ where: { BlogId: blogId, tagId: tag.id } })

            if (alreadyAttached) {
                return res.status(400).send({
                    "success": false,
                    "error": {
                        "message": `Tag '${tagName}' is already added to this blog`
                    }
                })
            }

            if (!alreadyAttached) {

                tag.addBlogs([blogId]);
                tag.save();
            }

            return res.status(201).send({
                "success": true,
                "content": {
                    "data": tag
                }
            });

        } catch (err) {

            console.log(err);
            return res.status(500).send("Something went wrong")
        }
    }

    async edit(req, res) {
        try {

            const blogId = req.params.blogId;
            const tagId = req.params.tagId;

            const userId = req.userId;
            const tagName = req.body.tagName;

            const user = await User.findOne({ where: { id: userId } });

            const blog = await Blog.findOne({ where: { id: blogId, UserId: userId } })

            // if blog does not belong to user
            if (!blog && user.role != 'admin') {
                return res.status(400).send({
                    "success": false,
                    "error": {
                        "message": "Unauthorized request"
                    }

                })
            }

            let tag = await Tag.findOne({ where: { id: tagId } });
            //  if no tag found with provided tagId by user
            if (!tag) {

                return res.status(400).send({
                    "sucess": false,
                    "error": {
                        "message": "TagId Not found"
                    }
                })

            }

            const blogTag = await BlogTag.findOne({ where: { BlogId: blogId, TagId: tagId } });

            if(!blogTag){
                return res.status(400).send({
                    "success":false,
                    "error":{
                        "message":"TagId not found in Blog"
                    }
                })
            }

            let replaceWithTag = await Tag.findOne({ where: { tagName: tagName } });

            if (!replaceWithTag) {
                replaceWithTag = await Tag.create({
                    tagName: tagName
                })
            }

            blogTag.TagId = replaceWithTag.id;
            blogTag.save();

            return res.status(201).send({
                "success": true,
                "content": {
                    "data": {
                        "editedTag": replaceWithTag
                    }
                }
            })

        } catch (err) {

            console.log(err);
            return res.status(500).send("Something went wrong")
        }
    }

    async delete(req, res) {

        try {

            const blogId = req.params.blogId;
        
            const tagId = req.params.tagId;
            const userId = req.userId;


            const user = await User.findOne({ where: { id: userId } });
            const blog = await Blog.findOne({ where: { id: blogId, UserId: userId } })

            if (!blog && user.role != 'admin') {
                return res.status(400).send({
                    "success": false,
                    "error": {
                        "message": "Unauthorized request"
                    }
                })
            }

            const associatedTag = await BlogTag.findOne({where:{BlogId:blogId,TagId:tagId}});

            if(!associatedTag){
                return res.status(400).send({
                    "success":false,
                    "error":{
                        "message":"TagId not found in Blog"
                    }
                })
            }

            await associatedTag.destroy();

            const otherBlogsWithTag = await BlogTag.findOne({where:{TagId:tagId}});

            if(!otherBlogsWithTag){
                await Tag.destroy({where:{id:tagId}});
            }

            return res.status(201).send({
                "success":true,
            })

        } catch (err) {

            console.log(err);
            return res.status(500).send("Something went wrong")
        }
    }
}