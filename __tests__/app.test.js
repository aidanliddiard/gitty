const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('gitty routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it.skip('should redirect to the github oauth page upon login', async () => {
    const res = await request(app).get('/api/v1/github/login');
    expect(res.header.location).toMatch();
  });
  afterAll(() => {
    pool.end();
  });
});
