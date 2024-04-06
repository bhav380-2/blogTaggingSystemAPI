// ___imports___
const { Blog, Tag, User, BlogTag } = require('../models');

// _______________________________Tag Controller___________________________________________
module.exports = class TagController {

    // ________________add tag_________________________
    async add(req, res) {

        try {

            const blogId = req.params.blogId;
            const userId = req.userId;
            const tagName = req.body.tagName;

            // finds blog by blogId and userId
            const blog = await Blog.findOne({ where: { id: blogId, UserId: userId } })

            // if blog not found, blogs does not belong to logged in user
            // user can't add tag to this blog as blog does not belong to user
            // return response with status code 401 (Unauthorized request)
            if (!blog) {
                return res.status(401).send({
                    "success": false,
                    "message": "Unauthorized request"
                })
            }

            // checks if tag with tagName is already present in Tags table
            let tag = await Tag.findOne({ where: { tagName: tagName } });

            // if tag is not already present in Tags table
            //create new tag with tagName and store it inside tag variable
            if (!tag) {
                tag = await Tag.create({
                    tagName: tagName
                })
            }

            // checks if this tag was already added to blog
            const alreadyAttached = await BlogTag.findOne({ where: { BlogId: blogId, tagId: tag.id } })

            // if tag is already attached to blog
            // return response with status code 400 
            if (alreadyAttached) {
                return res.status(400).send({
                    "success": false,
                    "error": {
                        "message": `Tag '${tagName}' is already added to this blog`
                    }
                })
            }

            // add tag to blog
            tag.addBlogs([blogId]);
            tag.save();

            // return response with status code 201
            return res.status(201).send({
                "success": true,
                "content": {
                    "data": tag
                }
            });

        } catch (err) {

            return res.status(500).send("Something went wrong")
        }
    }

    // ______________________edit tag_________________________
    async edit(req, res) {
        try {

            const blogId = req.params.blogId;
            const tagId = req.params.tagId;

            const userId = req.userId;
            const tagName = req.body.tagName;


            // find user using userId
            const user = await User.findOne({ where: { id: userId } });

            // find blog using blogId and userId
            const blog = await Blog.findOne({ where: { id: blogId, UserId: userId } })

           // handles unauthorized request
            if (!blog && user.role != 'admin') {
                return res.status(400).send({
                    "success": false,
                    "error": {
                        "message": "Unauthorized request"
                    }

                })
            }

            // if user is admin or blog belongs to logged in user

            // find tag by tagId
            let tag = await Tag.findOne({ where: { id: tagId } });
            
            // if tag not found
            // return response with status code 404
            if (!tag) {

                return res.status(404).send({
                    "sucess": false,
                    "error": {
                        "message": "TagId Not found"
                    }
                })

            }

            // checks if blog has tag with tag id as tagId
            const blogTag = await BlogTag.findOne({ where: { BlogId: blogId, TagId: tagId } });

            //if blog does not have tag with its id as tagId
            // return response with status code 404
            if(!blogTag){
                return res.status(404).send({
                    "success":false,
                    "error":{
                        "message":"TagId not found in Blog"
                    }
                })
            }

            // check if the new tag with name as tagName which we have to put in blog is already present in Tags table

            let replaceWithTag = await Tag.findOne({ where: { tagName: tagName } });

            // if new tag is not already present in Tags table,
            //  create new tag with name as tagName ,inside Tags table
            if (!replaceWithTag) {
                replaceWithTag = await Tag.create({
                    tagName: tagName
                })
            }


            // store replaceWithTag.id inside blogTag's TagId property
            // this will update value stored in TagId column of BlogTags table 
            //for row having blog's id value as blogId and tag's id value as tagId
            blogTag.TagId = replaceWithTag.id;
            blogTag.save();


            // return response with status code
            return res.status(200).send({
                "success": true,
            })

        } catch (err) {

            return res.status(500).send("Something went wrong")
        }
    }

    // ____________________delete tag__________________________
    async delete(req, res) {

        try {

            const blogId = req.params.blogId;
            const tagId = req.params.tagId;
            const userId = req.userId;


            // finds user by userId
            const user = await User.findOne({ where: { id: userId } });

            // finds blog by blogId and userId
            const blog = await Blog.findOne({ where: { id: blogId, UserId: userId } })

            // if user is not admin or blog does not belong to logged in user
            // return response with status code 400
            if (!blog && user.role != 'admin') {
                return res.status(400).send({
                    "success": false,
                    "error": {
                        "message": "Unauthorized request"
                    }
                })
            }


            // checks if tag is associated with blog
            const associatedTag = await BlogTag.findOne({where:{BlogId:blogId,TagId:tagId}});

            // if tag is not found in blog
            // return response with status code 404
            if(!associatedTag){
                return res.status(404).send({
                    "success":false,
                    "error":{
                        "message":"TagId not found in Blog"
                    }
                })
            }

            // if tag found in this blog 
            // delete associatedTag
            await associatedTag.destroy();

            //checks if deleted tag is associated with other Blogs
            const otherBlogsWithTag = await BlogTag.findOne({where:{TagId:tagId}});

            // if tag is not associated with other Blogs
            // delete tag from Tags table
            if(!otherBlogsWithTag){
                await Tag.destroy({where:{id:tagId}});
            }

            // return response with status code 201 and "success":true
            return res.status(204).send({
                "success":true,
            })

        } catch (err) {

            return res.status(500).send("Something went wrong")
        }
    }
}