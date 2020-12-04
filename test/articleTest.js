// process.env.NODE_ENV = 'test';

let Post = require('../models/post');
const fs=require('fs');
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
const { send } = require("process");
let should = chai.should();
chai.use(chaiHttp);

let testId="";
let testId1="5fc6bee5d9d6aa3cf80de0e9";
let id="";

let user = {email:'faisaledgar@example.com', password: 'password1234'}
let token = ''


describe('Articles', () => {

        it('It should LOGIN a user', (done) => {
          chai.request(app)
          .post('/api/user/login')
          .send(user)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('message').eql("auth successful")
              res.body.should.have.property('token')
              token = res.body.token
              id=res.body._id
          done();
          })
      })

      it('it should GET all the Articles', (done) => {
            chai.request(app)
            .get('/api/articles/')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
      });

      it('it should POST an Article with all properties ', (done) => {
        chai.request(app)
        .post('/api/articles')
        .set("authorization",`Bearer ${token}`)
        .set('content-type','multipart/form-data')
        .field('title','the lord of the Rings')
        .field('body','this is my first testing body')
        .attach('coverImage',fs.readFileSync(`${__dirname}/IMG-20181102-WA0005.jpg`), 'test/IMG-20181102-WA0005.jpg')
        .end((err,res)=>{
            res.should.have.status(200)
            res.body.should.be.a('object');
            res.body.should.have.property('_id');
            testId=res.body._id;
            res.body.should.have.property('title');
            res.body.should.have.property('body');
            res.body.should.have.property('image');
            done();
        })
      });


      it('it should not POST an Article with out an cover-image', (done) => {
          let article = new Post({
              title: "The Lord of the Rings",
              body: "this is my first testing body"
          });
            chai.request(app)
            .post('/api/articles')
            .set("authorization",`Bearer ${token}`)
            .set('content-type','multipart/form-data')
            .field('title','the lord of the Rings')
            .field('body','this is my first testing body')
            .end((err, res) => {
                  res.should.have.status(500);
                  res.body.should.be.a('object');
              done();
            });
      });
  
      it('it should not POST an Article with out a title', (done) => {
          chai.request(app)
          .post('/api/articles')
          .set("authorization",`Bearer ${token}`)
          .set('content-type','multipart/form-data')
          .field('body','this is my first testing body')
          .attach('coverImage',fs.readFileSync(`${__dirname}/IMG-20181102-WA0005.jpg`), 'test/IMG-20181102-WA0005.jpg')
          .end((err,res)=>{
              res.should.have.status(500)
              res.body.should.be.a('object');
              res.body.should.have.property('errors');
              res.body.errors.should.have.property('title');
              res.body.errors.title.should.have.property('message');
              res.body.errors.title.message.should.be.eql('Path `title` is required.');
              done()
          })
        });

        it('it should not POST  an Article with out a body', (done) => {
          chai.request(app)
          .post('/api/articles')
          .set("authorization",`Bearer ${token}`)
          .set('content-type','multipart/form-data')
          .field('title','the lord of the Rings')
          .attach('coverImage',fs.readFileSync(`${__dirname}/IMG-20181102-WA0005.jpg`), 'test/IMG-20181102-WA0005.jpg')
          .end((err,res)=>{
              res.should.have.status(500)
              res.body.should.be.a('object');
              res.body.should.have.property('errors');
              res.body.errors.should.have.property('body');
              res.body.errors.body.should.have.property('message');
              res.body.errors.body.message.should.be.eql('Path `body` is required.');
              done()
          })
        });

      it('it should GET an article by the given id', (done) => {
          chai.request(app)
          .get('/api/articles/'+testId)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('_id');
              res.body.should.have.property('title');
              res.body.should.have.property('body');
              done();
          });
      });

      it('it should not GET an article by the given id', (done) => {
        chai.request(app)
        .get('/api/articles/'+testId1)
        .end((err, res) => {
            res.should.have.status(404);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql("No valid Post for the provided ID");
            done();
        });
    });

    it('it should not GET an article by bad id given', (done) => {
      chai.request(app)
      .get('/api/articles/'+"5fc6bee5d9d6aa3cf80de0")
      .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a('object');
          res.body.should.have.property('error');
          done();
      });
    });

    it('it should UPDATE an article of given id', (done) => {
        chai.request(app)
        .put('/api/articles/'+testId)
        .set("authorization",`Bearer ${token}`)
        .send({title:"kalsdjlasjdlsdj", body: "nfkasidfisdfhsil"})
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            done();
        });
    });

    it('it should UPDATE an article of given id', (done) => {
      chai.request(app)
      .put('/api/articles/'+"5fc6bee5d9d6aa3cf80de0")
      .set("authorization",`Bearer ${token}`)
      .send({title:"kalsdjlasjdlsdj", body: "nfkasidfisdfhsil"})
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        done();
      });
    });

    it('it should DELETE an article given the id', (done) => {
          chai.request(app)
          .delete('/api/articles/' + testId)
          .set("authorization",`Bearer ${token}`)
          .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.should.have.property('ok').eql(1);
              done();
          });
        });

        it('it should not DELETE an article given a wrong id', (done) => {
          chai.request(app)
          .delete('/api/articles/' + "5fc6bee5d9d6aa3cf80de0")
          .set("authorization",`Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(500);
            res.body.should.be.a('object');
            done();
          });

    });
})


