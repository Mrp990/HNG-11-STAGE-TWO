const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Replace with your app entry point
const expect = chai.expect;

chai.use(chaiHttp);

describe('End-to-End Tests for Protected Endpoints', () => {
  let accessToken = '';

  // Before tests, authenticate user and retrieve access token
  before((done) => {
    chai
      .request(app)
      .post('/auth/login')
      .send({
        email: 'john.doe@example.com',
        password: 'password123',
      })
      .end((err, res) => {
        accessToken = res.body.data.accessToken; // Store access token for subsequent requests
        done();
      });
  });

  it('should retrieve user\'s own record', (done) => {
    chai
      .request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal('success');
        expect(res.body.data.email).to.equal('john.doe@example.com');
        // Add more assertions as needed
        done();
      });
  });

  it('should retrieve user\'s organizations', (done) => {
    chai
      .request(app)
      .get('/api/organisations')
      .set('Authorization', `Bearer ${accessToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal('success');
        expect(res.body.data.organisations).to.be.an('array');
        // Add more assertions as needed
        done();
      });
  });

  it('should retrieve single organization', (done) => {
    // Assuming orgId is a valid organization ID belonging to the user
    const orgId = 'organization_id_here';

    chai
      .request(app)
      .get(`/api/organisations/${orgId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal('success');
        expect(res.body.data.orgId).to.equal(orgId);
        // Add more assertions as needed
        done();
      });
  });

  it('should create new organization', (done) => {
    chai
      .request(app)
      .post('/api/organisations')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'New Organization',
        description: 'A new organization created in tests',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body.status).to.equal('success');
        expect(res.body.data.name).to.equal('New Organization');
        // Add more assertions as needed
        done();
      });
  });

  it('should add user to organization', (done) => {
    // Assuming orgId and userId are valid IDs
    const orgId = 'organization_id_here';
    const userId = 'user_id_here';

    chai
      .request(app)
      .post(`/api/organisations/${orgId}/users`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        userId: userId,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal('success');
        expect(res.body.message).to.equal('User added to organisation successfully');
        // Add more assertions as needed
        done();
      });
  });

  // Add more tests for other protected endpoints as per your requirements
});
