const request = require('supertest');
const { app } = require('./app'); 

describe('Express App', () => {
  it('responds with 404 for invalid routes', async () => {
    const response = await request(app).get('/invalid-route');
    expect(response.status).toBe(404);
  });

  it('responds with 200 for the root route', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  it('responds with 200 for the /auth/callback route', async () => {
    const response = await request(app).get('/auth/callback');
    expect(response.status).toBe(200);
  });

  it('responds with 200 for the /metrics route', async () => {
    const response = await request(app).get('/metrics');
    expect(response.status).toBe(200);
  });

  it('responds with 200 for the /api route', async () => {
    const response = await request(app).get('/api');
    expect(response.status).toBe(200);
  });

});
