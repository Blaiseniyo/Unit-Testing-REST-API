
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
const { send } = require("process");
let should = chai.should();
chai.use(chaiHttp);

let testId="5fc6bee5d9d6aa3cf80de0e9";

describe('# Comments testing block', () => {
  
    it('It should create a comment', (done) => {
        let comment={name:"Tonton",comment:"let's to this"}
        chai.request(app)
        .post('/api/comment/'+testId)
        .send(comment)
        .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a("object")
            res.body.should.have.property('name').eql(comment.name)
            done()
        })
    })
  
    it('It should get all comments for the provided post-Id', (done) => {
        chai.request(app)
        .get('/api/comment/'+testId)
        .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a("object")
            done()
        })
    })
  
    it('It should not get all comments for post-Id that that does not have comments', (done) => {
      chai.request(app)
      .get('/api/comment/'+"5fc6e107370b0e382ce38476")
      .end((err, res) => {
          res.should.have.status(404)
          res.body.should.be.a("object")
          res.body.should.have.property("message").eql("No valid Post for the provided ID")
          done()
      })
    })

    it('It should give an error if bad incomplete is given', (done) => {
        let comment={name:"Tonton"}
        chai.request(app)
        .post('/api/comment/'+testId)
        .send(comment)
        .end((err, res) => {
            res.should.have.status(500)
            res.body.should.be.a("object")
            res.body.should.have.property('error')
            done()
        })
      })
  })
  