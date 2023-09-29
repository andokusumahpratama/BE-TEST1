const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;
chai.use(chaiHttp);

const akun = {
    id: 15,
    name: "brenda",
    email: "brenda@gmail.com",
    role: "user",
    password: "$2a$12$GwhSmApxI7SU9nsK3XqmAecM3ZfMv4QFZ2iImzG2/u2pbopgJArsC"
}

describe('API DATA ATTACK', () => {
    it('should get data for a specific source country with role user', (done) => {
      chai
        .request("http://127.0.0.1:5000")
        .get('/api/v1/data/source-type/BR')        
        .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsImlhdCI6MTY5NTk1NzQ2MiwiZXhwIjoxNjk2MTMwMjYyfQ.AyMTF1UVNSnCqz61lhyJIjsZHeQp1_UP7sQAP_LiLzY')
        .end((err, res) => {            
          expect(res).to.have.status(200);
          expect(res.body.success).to.equal(true);
          done();
        });
    });     

    it('should not get data for a specific source country because role is not allowed', (done) => {
        chai
          .request("http://127.0.0.1:5000")
          .get('/api/v1/data/source-type/BR')        
          .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjk1OTU4NjE2LCJleHAiOjE2OTYxMzE0MTZ9.5HUBJOP3NmlnQM-Eaj0mm4GxML0NW-YOjRgXS4JEQj0')
          .end((err, res) => {            
            expect(res).to.have.status(403);
            expect(res.body.message).to.equal('You do not have permission to access');
            done();
          });
      });    
});