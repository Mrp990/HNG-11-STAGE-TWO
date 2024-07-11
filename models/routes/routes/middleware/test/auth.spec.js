const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Replace with your app entry point
const expect = chai.expect;

chai.use(chaiHttp);

describe('End-to-End Tests for /auth/register Endpoint', () => {
  it('should register user successfully with default organisation', (done) => {
    chai
      .request(app)
      .post('/auth/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        phone: '1234567890',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.status).to.equal('success');
        expect(res.body.message).to.equal('Registration successful');
        expect(res.body.data.accessToken).to.be.a('string');
        expect(res.body.data.user).to.include({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '1234567890',
        });
        done();
      });
  });

  it('should fail registration if required fields are missing', (done) => {
    chai
      .request(app)
      .post('/auth/register')
      .send({
        // Missing required fields intentionally
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body.status).to.equal('error');
        expect(res.body.message).to.equal('Validation failed');
        expect(res.body.errors).to.be.an('array').that.is.not.empty;
        done();
      });
  });

  it('should fail registration if email is already registered', (done) => {
    chai
      .request(app)
      .post('/auth/register')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'john.doe@example.com', // Same email as used in successful registration
        password: 'password456',
        phone: '9876543210',
      })
      .end((err, res) => {
        expect(res).to.have.status(422);
        expect(res.body.status).to.equal('error');
        expect(res.body.message).to.equal('Validation failed');
        expect(res.body.errors).to.be.an('array').that.is.not.empty;
        done();
      });
  });

  // Add more tests for other scenarios as per your requirements
});
