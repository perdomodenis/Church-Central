import * as eventService from './eventService';
import * as firebase from './firebase';

jest.mock('./firebase');  // Mocked Firebase Modul

describe('Event Service', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getAllEvents returns formatted array of events', async () => {
    const mockDocs = [
      { id: '1', data: () => ({ name: 'Event 1', date: '2026-06-01' }) },
      { id: '2', data: () => ({ name: 'Event 2', date: '2026-06-02' }) },
    ];

    firebase.getDocs.mockResolvedValue({
      docs: mockDocs
    });

    const result = await eventService.getAllEvents();

    expect(result).toEqual([
      { id: '1', name: 'Event 1', date: '2026-06-01' },
      { id: '2', name: 'Event 2', date: '2026-06-02' },
    ]);
  });

  test('getEventById returns single event', async () => {
    const mockDoc = {
      exists: () => true,
      id: '1',
      data: () => ({ name: 'Event 1' })
    };

    firebase.getDoc.mockResolvedValue(mockDoc);

    const result = await eventService.getEventById('1');

    expect(result).toEqual({ id: '1', name: 'Event 1' });
  });

  test('getEventById returns null when event does not exist', async () => {
    const mockDoc = {
      exists: () => false,
    };

    firebase.getDoc.mockResolvedValue(mockDoc);

    const result = await eventService.getEventById('nonexistent');

    expect(result).toBeNull();
  });

  test('createEvent throws error when Firebase fails', async () => {
    firebase.addDoc.mockRejectedValue(new Error('Firebase error'));

    await expect(eventService.createEvent({ name: 'Test' }))
      .rejects
      .toThrow('Firebase error');
  });
});