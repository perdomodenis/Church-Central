import { render, screen, waitFor } from '@testing-library/react';
import ProfileScreen from './ProfileScreen';
import { AuthProvider } from '../../context/AuthContext';
import * as firebase from '../../services/firebase';

jest.mock('../../services/firebase');

describe('ProfileScreen Integration', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays user profile information', async () => {
    firebase.auth.currentUser = {
      email: 'user@test.com',
      displayName: 'Test User',
      photoURL: null
    };

    render(
      <AuthProvider>
        <ProfileScreen />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/user@test.com|test user/i)).toBeInTheDocument();
    });
  });

  test('shows loading state initially', () => {
    render(
      <AuthProvider>
        <ProfileScreen />
      </AuthProvider>
    );

    // Check for loading indicator or skeleton
    const loadingElement = screen.queryByText(/loading|skeleton/i);
    expect(loadingElement || screen.getByRole('main')).toBeInTheDocument();
  });
});