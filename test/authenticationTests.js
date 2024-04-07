const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const should = chai.should();
const { sequelize, Blog, Tag, BlogTag, User } = require('../models');
chai.use(chaiHttp);

let token = "";


describe('Authentication and authorization checks', () => {


    before(async () => {


        Blog.belongsToMany(Tag, { through: BlogTag });
        Tag.belongsToMany(Blog, { through: BlogTag });
        User.hasMany(Blog);
        Blog.belongsTo(User);

        await sequelize.authenticate();
        await sequelize.sync({ force: true });


        const response = await chai.request(app)
            .post("/api/v1/auth/signup")
            .send({ "name": "user 1", "email": "1@gmail.com", "password": "11111111" })

        token = response.body.content.meta.access_token;


        await User.bulkCreate([
            // { name: 'user 1', email: "1@gmail.com", password: "11111111" },
            { name: 'user 2', email: "2@gmail.com", password: "11111111" },
            { name: 'user 3', email: "3@gmail.com", password: "11111111" },
            { name: 'user 4', email: "4@gmail.com", password: "11111111" },
        ])
        await Blog.bulkCreate([
            { title: 'Test Blog 1', content: 'Lorem ipsum...', UserId: 1 },
            { title: 'Test Blog 2', content: 'Dolor sit amet...', UserId: 2 },
            { title: 'Test Blog 3', content: 'Lorem ipsum...', UserId: 1 },
            { title: 'Test Blog 4', content: 'Dolor sit amet...', UserId: 2 },
            { title: 'Test Blog 5', content: 'Lorem ipsum...', UserId: 3 },
        ]);

        const tags = await Tag.bulkCreate([
            { tagName: 'tag1' },
            { tagName: 'tag2' },
            { tagName: 'tag3' },
            { tagName: 'tag4' }
        ]);

        await Tag.findAll()
            .then(async (Tags) => {
                await Tags[0].addBlogs(1);
                await Tags[1].addBlogs(1);

                await Tags[0].addBlogs(2);
                await Tags[1].addBlogs(3);
                await Tags[0].save();
                await Tags[1].save();
            });
    })

    it('should not allow user to add blog, if user is not logged in', (done) => {

        let wrongToken = "zjeiwaijd283828ng.fjdjfiei"
        chai.request(app)
            .post('/api/v1/blog/add')
            .auth(wrongToken, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.error.should.have.property('message').equals('You need to sign in to proceed.')
                done()
            })
    })

    it('should not allow user to delete blog , if blog does not belong to logged in user', (done) => {

        chai.request(app)
            .delete('/api/v1/blog/delete/2')
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('message').equals('Unauthorized request');
                done();
            })
    })

    it('should  delete blog , if blog belong to logged in user', (done) => {

        chai.request(app)
            .delete('/api/v1/blog/delete/1')
            .auth(token, { type: 'bearer' })
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    })

    it('should not allow user to add tag in particular blog , if that blog does not belong to logged in user', (done) => {

        chai.request(app)
            .post('/api/v1/tag/add/2')
            .auth(token, { type: 'bearer' })
            .send({ tagName: "newTag" })
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.have.property('message').equals('Unauthorized request');
                done();
            })
    })

    it('should allow user to add tag in particular blog , if that blog belong to logged in user', (done) => {

        chai.request(app)
            .post('/api/v1/tag/add/3')
            .auth(token, { type: 'bearer' })
            .send({ tagName: "newTag" })
            .end((err, res) => {
                res.should.have.status(201);
                done();
            })
    })


    it('should not allow user to edit tag in particular blog , if that blog does not belong to logged in user', (done) => {

        chai.request(app)
            .put('/api/v1/tag/edit/4/2')
            .auth(token, { type: 'bearer' })
            .send({ tagName: "newTag" })
            .end((err, res) => {
                res.should.have.status(401);
                done();
            })
    })

    it('should allow user to edit tag in particular blog , if that blog belong to logged in user', (done) => {

        chai.request(app)
            .put('/api/v1/tag/edit/3/2')
            .auth(token, { type: 'bearer' })
            .send({ tagName: "newTag" })
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    })

    it('should not allow user to delete tag in particular blog , if that blog does not belong to logged in user', (done) => {

        chai.request(app)
            .delete('/api/v1/tag/delete/2/2')
            .auth(token, { type: 'bearer' })
            .send({ tagName: "newTag" })
            .end((err, res) => {
                res.should.have.status(401);
                done();
            })
    })

    it('should allow user to delete tag in particular blog , if that blog belong to logged in user', (done) => {

        chai.request(app)
            .delete('/api/v1/tag/delete/3/2')
            .auth(token, { type: 'bearer' })
            .send({ tagName: "newTag" })
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    })


    after(async () => {

        await sequelize.sync({ force: true });
    })
})


