let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
const { send } = require("process");
let should = chai.should();
chai.use(chaiHttp);

describe('# URL test lock', () => {
  
    it('It should add a Access-Control-Allow-Methods on every header', (done) => {
        chai.request(app)
        .options('/api/')
        .end((err, res) => {
            res.should.have.status(200)
            res.header.should.have.property("access-control-allow-origin")
            res.body.should.be.a("object")
            done()
        })
    })
  
    it('It should return a error if bad URL provided', (done) => {
      chai.request(app)
      .post('/worng')
      .end((err, res) => {
          res.should.have.status(404)
          res.body.should.be.a("object")
          res.body.should.have.property('error')
          done()
      })
  })
  
  })