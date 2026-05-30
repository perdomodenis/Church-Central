import { render, screen, waitFor } from '@testing-library/react';
import FeedScreen from './FeedScreen';
import { AuthProvider } from '../../context/AuthContext';
import * as eventService from '../../services/eventService';

jest.mock('../../services/eventService');

describe('FeedScreen Integration', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays events fetched from service', async () => {
    const mockEvents = [
      { id: '1', title: 'Event 1', description: 'Description 1' },
      { id: '2', title: 'Event 2', description: 'Description 2' },
    ];

    eventService.getAllEvents.mockResolvedValue(mockEvents);

    render(
      <AuthProvider>
        <FeedScreen />
      </AuthProvider>
    );

    //Wartet darauf, dass die Ereignisse im Dokument erscheinen
    await waitFor(() => {
      expect(screen.getByText('Event 1')).toBeInTheDocument();
      expect(screen.getByText('Event 2')).toBeInTheDocument();
    });

    // Stellt sicher, dass die Service-Funktion aufgerufen wurde
    expect(eventService.getAllEvents).toHaveBeenCalled();
  });

  test('shows error message when service fails', async () => {
    eventService.getAllEvents.mockRejectedValue(new Error('Network error'));

    render(
      <AuthProvider>
        <FeedScreen />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
    });
  });

  test('shows loading state while fetching', () => {
    eventService.getAllEvents.mockImplementation(
      () => new Promise(() => {})  // Löst nie = bleibt im Ladezustand
    );

    render(
      <AuthProvider>
        <FeedScreen />
      </AuthProvider>
    );

    expect(screen.getByText(/loading|please wait/i)).toBeInTheDocument();
  });
});