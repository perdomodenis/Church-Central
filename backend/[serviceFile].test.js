const serviceModule = require('./[serviceFile]');
const firebaseAdmin = require('firebase-admin');

jest.mock('firebase-admin');

describe('[Service Name]', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('function returns expected data', async () => {
    // Arrange - setup mocks and test data
    const mockData = { id: '1', name: 'Test' };
    firebaseAdmin.firestore().collection().get.mockResolvedValue({
      docs: [{ id: '1', data: () => mockData }]
    });

    // Act - call the function
    const result = await serviceModule.getFunction();

    // Assert - verify the result
    expect(result).toEqual(expect.any(Array));
  });

  test('function throws error on failure', async () => {
    firebaseAdmin.firestore().collection().get
      .mockRejectedValue(new Error('Database error'));

    await expect(serviceModule.getFunction())
      .rejects
      .toThrow('Database error');
  });
});