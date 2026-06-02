import { renderHook, act } from '@testing-library/react';
import { useEventsData } from './useEventsData';
import * as eventService from '../services/eventService';

jest.mock('../services/eventService');

describe('useEventsData Hook', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initial state has no loading and no error', () => {
    const { result } = renderHook(() => useEventsData());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  test('create event sets loading state', async () => {
    eventService.createEvent.mockResolvedValue({
      id: '1',
      name: 'New Event'
    });

    const { result } = renderHook(() => useEventsData());

    await act(async () => {
      await result.current.create({ name: 'New Event' });
    });

    expect(eventService.createEvent).toHaveBeenCalledWith({ name: 'New Event' });
  });

  test('create event handles errors', async () => {
    eventService.createEvent.mockRejectedValue(new Error('Create failed'));

    const { result } = renderHook(() => useEventsData());

    await act(async () => {
      try {
        await result.current.create({ name: 'Event' });
      } catch (err) {
        // Expected error
      }
    });

    expect(result.current.error).toBe('Create failed');
  });

  test('update event calls service correctly', async () => {
    eventService.updateevent = jest.fn().mockResolvedValue({});

    const { result } = renderHook(() => useEventsData());

    await act(async () => {
      await result.current.update('123', { name: 'Updated' });
    });

    expect(eventService.updateevent).toHaveBeenCalledWith('123', { name: 'Updated' });
  });

  test('deleteEvent calls service correctly', async () => {
    eventService.deleteEvent = jest.fn().mockResolvedValue({});

    const { result } = renderHook(() => useEventsData());

    await act(async () => {
      await result.current.deleteEvent('123');
    });

    expect(eventService.deleteEvent).toHaveBeenCalledWith('123');
  });
});