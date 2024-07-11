const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Replace with your app entry point
const { User, Organisation } = require('../models'); // Replace with your Sequelize models

chai.use(chaiHttp);
const expect = chai.expect;

describe('Organisations Visibility', () => {
  let token; // Variable to store JWT token

  // Before each test, log in and get JWT token
  beforeEach(async () => {
    // Create a mock user (replace with actual user creation logic)
    const mockUser = await User.create({
      userId: '3',
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@example.com',
      password: 'password',
      phone: '9876543210',
    });

    // Log in user to get token
    const res = await chai.request(app)
      .post('/auth/login')
      .send({ email: 'alice.johnson@example.com', password: 'password' });

    token = res.body.data.accessToken;
  });

  it('should return organisations the user belongs to or created', async () => {
    // Create organisations (replace with actual organisation creation logic)
    const org1 = await Organisation.create({
      orgId: '1',
      name: 'Alice\'s Organisation',
      description: 'Organisation for Alice',
    });

    const org2 = await Organisation.create({
      orgId: '2',
      name: 'Shared Organisation',
      description: 'Organisation shared with Alice',
    });

    // Add user to organisations (replace with actual association logic)
    await org1.addUser('3');
    await org2.addUser('3');

    // Get organisations for the user with JWT token
    const res = await chai.request(app)
      .get('/api/organisations')
      .set('Authorization', `Bearer ${token}`);

    // Assertion
    expect(res).to.have.status(200);
    expect(res.body.status).to.equal('success');
    expect(res.body.data.organisations).to.be.an('array').that.has.lengthOf(2);
    expect(res.body.data.organisations.some(org => org.orgId === '1')).to.be.true;
    expect(res.body.data.organisations.some(org => org.orgId === '2')).to.be.true;
  });

  // Add more test cases for edge cases, unauthorized access, etc.
});
