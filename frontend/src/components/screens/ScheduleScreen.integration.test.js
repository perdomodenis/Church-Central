import { render, screen, waitFor } from '@testing-library/react';
import ScheduleScreen from './ScheduleScreen';
import { AuthProvider } from '../../context/AuthContext';
import * as eventService from '../../services/eventService';

jest.mock('../../services/eventService');

describe('ScheduleScreen Integration', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays schedule with upcoming events', async () => {
    const mockEvents = [
      { 
        id: '1', 
        title: 'Sunday Service', 
        date: '2026-06-07',
        time: '10:00 AM'
      },
      { 
        id: '2', 
        title: 'Bible Study', 
        date: '2026-06-10',
        time: '7:00 PM'
      }
    ];

    eventService.getAllEvents.mockResolvedValue(mockEvents);

    render(
      <AuthProvider>
        <ScheduleScreen />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Sunday Service')).toBeInTheDocument();
      expect(screen.getByText('Bible Study')).toBeInTheDocument();
    });
  });

  test('shows loading state initially', () => {
    eventService.getAllEvents.mockImplementation(
      () => new Promise(() => {})
    );

    render(
      <AuthProvider>
        <ScheduleScreen />
      </AuthProvider>
    );

    expect(screen.getByText(/loading|please wait/i)).toBeInTheDocument();
  });

  test('handles error when loading events fails', async () => {
    eventService.getAllEvents.mockRejectedValue(new Error('Network error'));

    render(
      <AuthProvider>
        <ScheduleScreen />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
    });
  });
});