import * as eventService from './eventService';

describe('Event Service', () => {

  test('service is defined', () => {
    expect(eventService).toBeDefined();
  });

  test('getAllEvents is a function', () => {
    expect(typeof eventService.getAllEvents).toBe('function');
  });

  test('getEventById is a function', () => {
    expect(typeof eventService.getEventById).toBe('function');
  });

  test('createEvent is a function', () => {
    expect(typeof eventService.createEvent).toBe('function');
  });

  test('updateEvent is a function', () => {
    expect(typeof eventService.updateEvent).toBe('function');
  });

  test('deleteEvent is a function', () => {
    expect(typeof eventService.deleteEvent).toBe('function');
  });
});
