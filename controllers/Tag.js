// ___imports___
const { Blog, Tag, User, BlogTag } = require('../models');

const Blogs = require('../models/Blog');
const Tags = require('../models/Tag');
const Users = require('../models/User');

// _______________________________Tag Controller___________________________________________
module.exports = class TagController {

    // ________________add tag_________________________
    async add(req, res) {

        try {

            const blogId = req.params.blogId;
            const userId = req.userId;
            const tagName = req.body.tagName;

            // finds blog by blogId and userId
            const blog = await Blogs.findById(blogId).populate({path:"tags"});

            // if blog not found, blogs does not belong to logged in user
            // user can't add tag to this blog as blog does not belong to user
            // return response with status code 401 (Unauthorized request)
            if (!blog || blog.author!=userId) {
                return res.status(401).send({
                    "success": false,
                    "message": "Unauthorized request"
                })
            }

              // checks if this tag was already added to blog
            let alreadyAttached = blog.tags.filter((t)=>{
                if(t.tagName==tagName){
                    return true;
                }

                return false;
            })

            console.log(alreadyAttached);
          
            // if tag is already attached to blog
            // return response with status code 400 
            if (alreadyAttached.length!=0) {
                return res.status(400).send({
                    "success": false,
                    "error": {
                        "message": `Tag '${tagName}' is already added to this blog`
                    }
                })
            }


            // checks if tag with tagName is already present in Tags table
            let tag = await Tags.findOne({tagName:tagName});

            // if tag is not already present in Tags table
            //create new tag with tagName and store it inside tag variable
            if (!tag) {
                tag = await Tags.create({
                    tagName: tagName
                })
            }

            blog.tags.push(tag._id);
            tag.blogs.push(blog._id);

            await blog.save();
            await tag.save();

            // return response with status code 201
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

    // ______________________edit tag_________________________
    async edit(req, res) {
        try {

            const blogId = req.params.blogId;
            const tagId = req.params.tagId;

            const userId = req.userId;
            const tagName = req.body.tagName;

            console.log(blogId);
            console.log(userId);


            // find user using userId
            const user = await Users.findById(userId);

            // find blog using blogId and userId
            const blog = await Blogs.findOne({_id:blogId, author:userId});
            console.log(blog);

           // handles unauthorized request
            if (!blog && user.role != 'admin') {
                return res.status(401).send({
                    "success": false,
                    "error": {
                        "message": "Unauthorized request"
                    }

                })
            }

            // if user is admin or blog belongs to logged in user

            // find tag by tagId
            let tag = await Tags.findById(tagId);
            
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

            // checks if blog has tag with its id as tagId
            const tagPresent = blog.tags.filter((t)=>{
                if(t._id==tagId){
                    return true;
                }

                return false;
            })

            //if blog does not have tag with its id as tagId
            // return response with status code 404
            if(tagPresent.length==0){
                return res.status(404).send({
                    "success":false,
                    "error":{
                        "message":"TagId not found in Blog"
                    }
                })
            }

            // check if tag with tagName is already present int db

            let newTag = await Tags.findOne({ tagName: tagName });

            // if new tag is not already present
            //  create new tag with name as tagName 
            if (!newTag) {
                newTag = await Tags.create({
                    tagName: tagName
                })
            }

            // remove old tagId from blog
            blog.tags = blog.tags.filter((t)=>{
                return t._id != tagId;
            })

            // remove blogId from old tag
           tag.blogs =  tag.blogs.filter((b)=>{
                return b._id!= blogId;
            })

            await tag.save();

            if(tag.blogs.length==0){   // this old tag is associated with no blogs delete it
                await tag.deleteOne();
            }

            // add newTag id in blog
            blog.tags.push(newTag._id);

            // add blogId in newTag
            newTag.blogs.push(blog._id);

            // save changes
           
            await newTag.save();
            await blog.save();

            // return response with status code
            return res.status(200).send({
                "success": true,
            })

        } catch (err) {
            console.log(err);
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
            const user = await Users.findById( userId );

            // finds blog by blogId and userId
            const blog = await Blogs.findOne({_id: blogId, author: userId })

            // if user is not admin or blog does not belong to logged in user
            // return response with status code 400
            if (!blog && user.role != 'admin') {
                return res.status(401).send({
                    "success": false,
                    "error": {
                        "message": "Unauthorized request"
                    }
                })
            }



            // remove tag from blog.tags having its id = tagId
            const updatedTags = blog.tags.filter((t)=>{
                return t._id!=tagId;
            })
          
            if(updatedTags.length==blog.tags.length){     // if tagId not found in blog
                return res.status(404).send({
                    "success":false,
                    "error":{
                        "message":"TagId not found in Blog"
                    }
                })
            }

            blog.tags = updatedTags;  //update blog.tags
            await blog.save();


            // find tag 
            const tag = await Tags.findById(tagId);

            // remove blogId from tag.blogs
            tag.blogs = tag.blogs.filter((b)=>{
                return b._id!=blogId;
            })

            await tag.save();
            // if tag is associated with no blogs , remove tag from db
            if(tag.blogs.length==0){
                console.log("Hi888888");
               await tag.deleteOne();
            }

         

            // return response with status code 201 and "success":true
            return res.status(200).send({
                "success":true,
            })

        } catch (err) {

            return res.status(500).send("Something went wrong")
        }
    }
}