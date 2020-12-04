
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
const { send } = require("process");
let should = chai.should();
chai.use(chaiHttp);

let id="";

let user = {email:'faisaledgar@example.com', password: 'password1234'}
let token = ''



describe('# Auth testing block', () => {
  
    it('It should create a user', (done) => {
        chai.request(app)
        .post('/api/user/signup')
        .send(user)
        .end((err, res) => {
            res.should.have.status(201)
            res.body.should.have.property('message').eql('user created')
            done()
        })
    })

    
    it('It should not create a user with an email that already exist ', (done) => {
      chai.request(app)
      .post('/api/user/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.status(409)
        res.body.should.have.property('message').eql('Mail exists')
        done()
      })
    })


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
    
    it('It should not LOGIN a user with a wrong email', (done) => {
      chai.request(app)
      .post('/api/user/login')
      .send({email:'11123faisaledgar@example.com', password: 'password1234'})
      .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a('object');
          res.body.should.have.property('error')
          res.body.error.should.have.property('message').eql("Auth failed")
      done();
      })
  })

  it('It should not LOGIN a user without password', (done) => {
    chai.request(app)
    .post('/api/user/login')
    .send({email:'faisaledgar@example.com'})
    .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql("auth failed")
    done();
    })
})

  it('It should not LOGIN a user with a wrong password', (done) => {
    chai.request(app)
    .post('/api/user/login')
    .send({email:'faisaledgar@example.com', password: 'password123'})
    .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql("auth failed")
    done();
    })
})

  it('It should not Delete a user when not authenticated', (done) => {
    chai.request(app)
    .delete('/api/user/delete/'+"5fc6bee5d9d6aa3cf80de0e9")
    .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql("Auth failed")
    done();
    })
  })

  it('It should not Delete a user with wrong Id', (done) => {
    chai.request(app)
    .delete('/api/user/delete/'+"5fc6bee5d9d6aa3cf80de0e9")
    .set("authorization",`Bearer ${token}`)
    .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql("wrong Id provided")
    done();
    })
  })
  
  it('It should not Delete a user an incorrect Id', (done) => {
    chai.request(app)
    .delete('/api/user/delete/'+"5fc6bee5d9d6aa3cf80de0")
    .set("authorization",`Bearer ${token}`)
    .end((err, res) => {
        res.should.have.status(500);
        res.body.should.be.a('object');
        res.body.should.have.property('error')
        done();
    })
  })
})