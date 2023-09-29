const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
chai.use(chaiHttp);

describe('API AUTH', () => {
    it('should return 200 for success Login', (done) => {
      chai
        .request("http://127.0.0.1:5000")
        .post('/api/v1/akun/login')
        .send({ email: "ando@gmail.com", password: "test1234" })
        .end((err, res) => {            
          expect(res).to.have.status(200);
          expect(res.body.status).to.equal('success');
          done();
        });
    });
  
    it('should return 401 for incorrect email and password', (done) => {
      chai
        .request("http://127.0.0.1:5000")
        .post('/api/v1/akun/login')
        .send({ email: "ando@gmail.coms", password: "test1234" })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body.status).to.equal('Fail');
          done();
        });
    });
});