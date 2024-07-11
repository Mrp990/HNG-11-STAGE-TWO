const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Replace with your app entry point
const expect = chai.expect;

chai.use(chaiHttp);

describe('End-to-End Tests for /auth/login Endpoint', () => {
  it('should login user successfully with valid credentials', (done) => {
    chai
      .request(app)
      .post('/auth/login')
      .send({
        email: 'john.doe@example.com',
        password: 'password123',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal('success');
        expect(res.body.message).to.equal('Login successful');
        expect(res.body.data.accessToken).to.be.a('string');
        expect(res.body.data.user).to.include({
          email: 'john.doe@example.com',
        });
        done();
      });
  });

  it('should fail login with invalid credentials', (done) => {
    chai
      .request(app)
      .post('/auth/login')
      .send({
        email: 'john.doe@example.com',
        password: 'incorrectPassword',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.equal('error');
        expect(res.body.message).to.equal('Authentication failed');
        expect(res.body).not.to.have.property('data');
        done();
      });
  });

  // Add more tests for other scenarios as per your requirements
});
