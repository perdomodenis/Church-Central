import { renderHook, act } from '@testing-library/react';
import { EventsProvider, useEvents } from './EventContext';
import * as eventService from '../services/eventService';

jest.mock('../services/eventService');

describe('useEvents Hook and EventsProvider', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('initial state shows loading', () => {
    eventService.getAllEvents.mockImplementation(
      () => new Promise(() => {})  // Never resolves
    );

    const { result } = renderHook(() => useEvents(), {
      wrapper: EventsProvider
    });

    expect(result.current.loading).toBe(true);
  });

  test('loads events successfully', async () => {
    const mockEvents = [
      { id: '1', name: 'Event 1' },
      { id: '2', name: 'Event 2' }
    ];

    eventService.getAllEvents.mockResolvedValue(mockEvents);

    const { result } = renderHook(() => useEvents(), {
      wrapper: EventsProvider
    });

    await act(async () => {
      // Wait for effect to complete
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.events).toEqual(mockEvents);
    expect(result.current.loading).toBe(false);
  });

  test('handles error when fetching fails', async () => {
    eventService.getAllEvents.mockRejectedValue(
      new Error('Fetch failed')
    );

    const { result } = renderHook(() => useEvents(), {
      wrapper: EventsProvider
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBe('Fetch failed');
    expect(result.current.loading).toBe(false);
  });

  test('clears error on successful fetch', async () => {
    const mockEvents = [{ id: '1', name: 'Event 1' }];

    eventService.getAllEvents.mockResolvedValue(mockEvents);

    const { result } = renderHook(() => useEvents(), {
      wrapper: EventsProvider
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.error).toBeNull();
  });
});