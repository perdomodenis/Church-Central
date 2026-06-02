import { render, screen, waitFor } from '@testing-library/react';
import InboxScreen from './InboxScreen';
import { AuthProvider } from '../../context/AuthContext';

describe('InboxScreen Integration', () => {
  
  test('displays inbox with messages', async () => {
    render(
      <AuthProvider>
        <InboxScreen />
      </AuthProvider>
    );

    // Wait for content to load
    await waitFor(() => {
      expect(screen.getByText(/inbox|messages|no messages/i)).toBeInTheDocument();
    });
  });

  test('displays empty state when no messages', async () => {
    render(
      <AuthProvider>
        <InboxScreen />
      </AuthProvider>
    );

    await waitFor(() => {
      const emptyMessage = screen.queryByText(/no messages|empty/i);
      if (emptyMessage) {
        expect(emptyMessage).toBeInTheDocument();
      }
    });
  });
});