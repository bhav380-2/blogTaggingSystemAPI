const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');
const should = chai.should();
const { sequelize, Blog, Tag, BlogTag, User } = require('../models');
chai.use(chaiHttp);


describe('Search Blog by Tags', () => {

    before(async () => {

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
    it('should return blogs with valid tags', (done) => {

        // let tags = {};
        chai.request(app)
            .get('/api/v1/blog/search?tags=tag1,tag2')
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

    it('should not return blogs when tags are not passed', (done) => {
        chai.request(app)
            .get('/api/v1/blog/search')
            // .send(tags)
            .end((err, res) => {
                const data = res.body.content.data;
                res.should.have.status(400);
                res.body.should.be.a('object');
                data.should.be.a('array');
                data.should.have.lengthOf(0);

                done();
            })
    })

    it("should return Blogs not found msg if tags doesn't match any blogs", (done) => {
        chai.request(app)
            .get('/api/v1/blog/search?tags=xyz,tag1')
            // .send(tags)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property('message').equals('Blogs not found')


                done();
            })
    })


    after(async () => {

        await sequelize.sync({ force: true });
    })


});






















