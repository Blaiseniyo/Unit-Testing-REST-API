// process.env.NODE_ENV = 'test';

let Post = require('../models/post');
let User = require('../models/user');
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

let messageId="";


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

describe('Articles', () => {
    
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

    it('it should not GET an article by the given id', (done) => {
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
})


describe('# message testing block', () => {
  
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

  it('It should a messages of a given Id', (done) => {
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

  it('It should a messages of a given Id', (done) => {
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

  it('It should not a update message of a wrong Id', (done) => {
    let message={name:"Blaise niyo",email:"blaiseblog1233@gmail.com",message:"I have work for you, Are you interested now"}
    chai.request(app)
    .put('/api/message/'+"5fc6bee5d9d6aa3cf80de")
    .set("authorization",`Bearer ${token}`)
    .send(message)
    .end((err, res) => {
        res.should.have.status(500)
        res.body.should.be.a("object")
        res.body.should.have.property("error")
        done()
    })
  })


})
// describe("# Message testing",()=>{

//   it("It should send a message", (done)=>{
//     chai.request(app)
//     .post("api/message")
//     .send({name:"Blaise",email:"blaiseblog@gmail.com",message:"I have work for you, Are you interested"})
//     .end((err, res) => {
//       res.should.have.status(200);
//       res.body.should.be.a('object');
//       done();
//     });
//   })

//   it("It should get all articles form the database",(done)=>{
//     chai.request(app)
//     .get("api/message")
//     .set("authorization",`Bearer ${token}`)
//     .end((err,res)=>{
//       res.should.have.status(200);
//       res.body.should.be.a("array")
//       done()
//     })
//   })

// })

