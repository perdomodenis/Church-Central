const request = require('supertest');
const express = require('express');
const firebaseAdmin = require('firebase-admin');

jest.mock('firebase-admin');

describe('[Feature Name] Integration', () => {
  let app;
  let mockDb;

  beforeEach(() => {
    // Setup Express app
    app = express();
    app.use(express.json());

    // Setup auth middleware
    const authMiddleware = require('../middleware/auth');
    app.use(authMiddleware);

    // Setup routes
    const routes = require('../routes/[feature]');
    app.use('/api', routes);

    // Setup Firebase mock
    mockDb = {
      collection: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue({ docs: [] }),
        doc: jest.fn().mockReturnValue({
          get: jest.fn().mockResolvedValue({ exists: true, data: () => ({}) }),
          set: jest.fn().mockResolvedValue(),
          update: jest.fn().mockResolvedValue(),
          delete: jest.fn().mockResolvedValue()
        }),
        add: jest.fn().mockResolvedValue({ id: 'new-id' })
      })
    };

    firebaseAdmin.firestore.mockReturnValue(mockDb);
    firebaseAdmin.auth.mockReturnValue({
      verifyIdToken: jest.fn().mockResolvedValue({ uid: 'user-123' })
    });
  });

  test('authenticated user can perform action', async () => {
    const response = await request(app)
      .post('/api/[feature]')
      .set('Authorization', 'Bearer valid-token')
      .send({ name: 'Test' })
      .expect(201);

    expect(mockDb.collection).toHaveBeenCalledWith('[collection]');
  });

  test('unauthenticated user cannot perform action', async () => {
    const response = await request(app)
      .post('/api/[feature]')
      .send({ name: 'Test' })
      .expect(401);
  });

  test('complete workflow: create → read → update → delete', async () => {
    // Create
    const createRes = await request(app)
      .post('/api/[feature]')
      .set('Authorization', 'Bearer valid-token')
      .send({ name: 'Test Item' })
      .expect(201);

    const itemId = createRes.body.id;

    // Read
    await request(app)
      .get(`/api/[feature]/${itemId}`)
      .set('Authorization', 'Bearer valid-token')
      .expect(200);

    // Update
    await request(app)
      .patch(`/api/[feature]/${itemId}`)
      .set('Authorization', 'Bearer valid-token')
      .send({ name: 'Updated' })
      .expect(200);

    // Delete
    await request(app)
      .delete(`/api/[feature]/${itemId}`)
      .set('Authorization', 'Bearer valid-token')
      .expect(204);
  });
});