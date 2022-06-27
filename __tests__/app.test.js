const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/services/github');

describe('gitty routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('should redirect to the github oauth page upon login', async () => {
    const res = await request(app).get('/api/v1/github/login');
    expect(res.header.location).toMatch(
      /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&scope=user&redirect_uri=http:\/\/localhost:7890\/api\/v1\/github\/callback/i
    );
  });
  it('should redirect to /dashboard after logging in', async () => {
    const res = await request
      .agent(app)
      .get('/api/v1/github/callback?code=42')
      .redirects(1);

    expect(res.body).toEqual({
      id: expect.any(String),
      username: 'mock_github_user',
      email: 'fake-email@example.com',
      avatar: expect.any(String),
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
  });
  afterAll(() => {
    pool.end();
  });
});
