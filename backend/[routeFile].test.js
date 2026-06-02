const request = require('supertest');
const express = require('express');

jest.mock('firebase-admin');  // Mock Firebase

describe('[Route Name] API', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    
    // Import your routes
    const routes = require('./[routeFile]');
    app.use('/api', routes);
  });

  describe('GET /api/[resource]', () => {
    test('returns 200 with data array', async () => {
      const response = await request(app)
        .get('/api/[resource]')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    test('returns 401 if unauthorized', async () => {
      const response = await request(app)
        .get('/api/[resource]')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/[resource]', () => {
    test('creates resource and returns 201', async () => {
      const newResource = {
        name: 'Test',
        description: 'Test description'
      };

      const response = await request(app)
        .post('/api/[resource]')
        .send(newResource)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Test');
    });

    test('returns 400 with invalid data', async () => {
      const response = await request(app)
        .post('/api/[resource]')
        .send({ invalid: 'data' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/[resource]/:id', () => {
    test('deletes resource and returns 204', async () => {
      await request(app)
        .delete('/api/[resource]/123')
        .expect(204);
    });
  });
});