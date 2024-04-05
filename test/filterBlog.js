const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const should = chai.should();
const { sequelize, Blog, Tag, BlogTag, User } = require('../models');
chai.use(chaiHttp);

// describe('db', () => {
// Hook to run before all tests

// })


describe('filter Blogs by tags, date, author', () => {
    before( async () => {

        Blog.belongsToMany(Tag, { through: BlogTag });
        Tag.belongsToMany(Blog, { through: BlogTag });
        User.hasMany(Blog);
        Blog.belongsTo(User);
    
    
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
    
        await User.bulkCreate([
            { name: 'user 1', email: "1@gmail.com", password: "11111111" },
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
                await Tags[0].save();
                await Tags[1].save();
            });
    });
    it('should filter Blogs by tags, if only tags are passed in req', (done) => {

        // let tags = {};
        chai.request(app)
            .get('/api/v1/blog/filter?tags=tag1,tag2')
            // .send(tags)
            .end((err, res) => {
                const data = res.body.content.data;
                res.should.have.status(200);
                res.body.should.be.a('object');
                data.should.be.a('array');
                data.should.have.lengthOf(1);
                data.should.have.property('0').to.deep.include({
                    id: 1,
                    title: 'Test Blog 1',
                    content: 'Lorem ipsum...',
                    UserId: 1,
                });

                done()
            })
    })

    it('should filter Blogs by author , if only author is passed in req', (done) => {

        // let tags = {};
        chai.request(app)
            .get('/api/v1/blog/filter?author=user 1')
            // .send(tags)
            .end((err, res) => {
                const data = res.body.content.data;
                res.should.have.status(200);
                res.body.should.be.a('object');
                data.should.be.a('array');
                data.should.have.lengthOf(2);
                data.should.have.property('0').to.deep.include({
                    id: 1,
                    title: 'Test Blog 1',
                    content: 'Lorem ipsum...',
                    UserId: 1,
                });
                data.should.have.property('1').to.deep.include({
                    id: 3,
                    title: 'Test Blog 3',
                    content: 'Lorem ipsum...',
                    UserId: 1,
                });

                done()
            })
    })

    it('should filter Blogs by date , if only date is passed in req', (done) => {

        // let tags = {};
        chai.request(app)
            .get('/api/v1/blog/filter?startDate=2024-04-05&endDate=2024-04-05')
            // .send(tags)
            .end((err, res) => {
                const data = res.body.content.data;
                res.should.have.status(200);
                res.body.should.be.a('object');
                data.should.be.a('array');
                data.should.have.lengthOf(5);
                data.should.have.property('0').to.deep.include({
                    id: 1,
                    title: 'Test Blog 1',
                    content: 'Lorem ipsum...',
                    UserId: 1,
                });
                done()
            })
    })

    it('should filter Blogs by date , if only date is passed in req', (done) => {

        // let tags = {};
        chai.request(app)
            .get('/api/v1/blog/filter?startDate=2024-04-05&endDate=2024-04-05')
            // .send(tags)
            .end((err, res) => {
                const data = res.body.content.data;
                res.should.have.status(200);
                res.body.should.be.a('object');
                data.should.be.a('array');
                data.should.have.lengthOf(5);
                data.should.have.property('0').to.deep.include({
                    id: 1,
                    title: 'Test Blog 1',
                    content: 'Lorem ipsum...',
                    UserId: 1,
                });
                done()
            })
    })

    it('should filter by tags and author , if only author and tags are passed in req', (done) => {

        // let tags = {};
        chai.request(app)
            .get('/api/v1/blog/filter?tags=tag1&author=user 2')
            // .send(tags)
            .end((err, res) => {
                const data = res.body.content.data;
                res.should.have.status(200);
                res.body.should.be.a('object');
                data.should.be.a('array');
                data.should.have.lengthOf(1);
                data.should.have.property('0').to.deep.include({
                    id: 2,
                    title: 'Test Blog 2',
                    content: 'Dolor sit amet...',
                    UserId: 2,
                });
                done()
            })
    })

    it('should filter blogs by date and author , if only date and author are passed in req', (done) => {
        // let tags = {};
        chai.request(app)
            .get('/api/v1/blog/filter?startDate=2024-04-05&endDate=2024-04-05&author=user 2')
            // .send(tags)
            .end((err, res) => {
                const data = res.body.content.data;
                res.should.have.status(200);
                res.body.should.be.a('object');
                data.should.be.a('array');
                data.should.have.lengthOf(2);
                data.should.have.property('0').to.deep.include({
                    id: 2,
                    title: 'Test Blog 2',
                    content: 'Dolor sit amet...',
                    UserId: 2,
                });
                done()
            })
    })

    it('should return message "must send atleast date, author or tags" , if nothing is passed in req', (done) => {
        // let tags = {};
        chai.request(app)
            .get('/api/v1/blog/filter')
            // .send(tags)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message').equals('must send alteast date , author or tags')
                done()
            })
    })

    it('should return message "Blogs not found", if blogs with passed filters are not found', (done) => {
        // let tags = {};
        chai.request(app)
            .get('/api/v1/blog/filter?author=randomUser&tags=randomTags')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property('message').equals('Blogs not found')
                done()
            })
    })


after( async () => {

    await sequelize.sync({ force: true });
})




});


after('filter Blogs by tags, date, author', async () => {

    await sequelize.sync({ force: true });
})

























