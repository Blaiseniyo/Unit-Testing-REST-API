// process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
const { send } = require("process");
let should = chai.should();
chai.use(chaiHttp);

let testId="5fc6d80a3e1e313ef02c1ed7";
let id="";

let messageId="";
let user = {email:'faisaledgar@example.com', password: 'password1234'}
let token = ''

describe('# message testing block', () => {
  
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
    it('It should send a message', (done) => {
        let message={name:"Blaise",email:"blaiseblog@gmail.com",message:"I have work for you, Are you interested"}
        chai.request(app)
        .post('/api/message')
        .send(message)
        .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a("object")
            res.body.should.have.property('name').eql(message.name)
            messageId=res.body._id
            done()
        })
    })
  
    it('It should all messages', (done) => {
      chai.request(app)
      .get('/api/message')
      .set("authorization",`Bearer ${token}`)
      .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a("array")
          done()
      })
    })
  
    it('It should get a messages of a given Id', (done) => {
      chai.request(app)
      .get('/api/message/'+messageId)
      .set("authorization",`Bearer ${token}`)
      .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a("object")
          res.body.should.have.property("message")
          done()
      })
    })
  
    it('It should not  get a messages of a wrong given Id', (done) => {
      chai.request(app)
      .get('/api/message/'+testId)
      .set("authorization",`Bearer ${token}`)
      .end((err, res) => {
          res.should.have.status(404)
          res.body.should.be.a("object")
          res.body.should.have.property("message").eql("No valid Post for the provided ID")
          done()
      })
    })
    
    it('It should not get a messages of a wrong Id', (done) => {
      chai.request(app)
      .get('/api/message/'+"5fc6bee5d9d6aa3cf80de0")
      .set("authorization",`Bearer ${token}`)
      .end((err, res) => {
          res.should.have.status(500)
          res.body.should.be.a("object")
          res.body.should.have.property("error")
          done()
      })
    })
  
    it('It should a update message of a given Id', (done) => {
      let message={name:"Blaise niyo",email:"blaiseblog1233@gmail.com",message:"I have work for you, Are you interested now"}
      chai.request(app)
      .put('/api/message/'+ messageId)
      .set("authorization",`Bearer ${token}`)
      .send(message)
      .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.a("object")
          done()
      })
    })
  
    // it('It should not a update message of a wrong Id', (done) => {
    //   let message={name:"Blaise",email:"blaiseblog1233@gmail.com",message:"I have work for you, Are you in"}
    //   chai.request(app)
    //   .put('/api/message/'+"5fc6be")
    //   .set("authorization",`Bearer ${token}`)
    //   .send(message)
    //   .end((err, res) => {
    //       res.should.have.status(400)
    //       res.body.should.be.a("object")
    //       res.body.should.have.property("message").eql("you provided a bad Id to delete")
    //       done()
    //   })
    // })
  
    it('it should DELETE an message given the id', (done) => {
      chai.request(app)
      .delete('/api/message/' + messageId)
      .set("authorization",`Bearer ${token}`)
      .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('ok').eql(1);
          done();
      });
    });
  
    it('it should not DELETE an message given a wrong id', (done) => {
      chai.request(app)
      .delete('/api/message/' + "5fc6bee5d9d6aa3cf80de0")
      .set("authorization",`Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        done();
      });
  
    });

    it('It should  Delete a user', (done) => {
        chai.request(app)
        .delete('/api/user/delete/'+id)
        .set("authorization",`Bearer ${token}`)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('message').eql("user deleted")
        done();
        })
    })
  
  })