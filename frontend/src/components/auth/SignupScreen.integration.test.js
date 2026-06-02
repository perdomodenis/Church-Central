import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignupScreen from './SignupScreen';
import { AuthProvider } from '../../context/AuthContext';
import * as firebaseAuth from '../../services/firebase';

jest.mock('../../services/firebase');

describe('SignupScreen Integration', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('complete signup flow with valid data', async () => {
    const user = userEvent.setup();

    firebaseAuth.createUserWithEmailAndPassword.mockResolvedValue({
      user: { uid: 'new-user-123', email: 'newuser@test.com' }
    });

    render(
      <AuthProvider>
        <SignupScreen onSignupSuccess={() => {}} />
      </AuthProvider>
    );

    // Get form inputs
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password|password again/i);
    const submitButton = screen.getByRole('button', { name: /sign up|create account/i });

    // User enters data
    await user.type(emailInput, 'newuser@test.com');
    await user.type(passwordInput, 'SecurePass123!');
    await user.type(confirmPasswordInput, 'SecurePass123!');
    await user.click(submitButton);

    // Verify signup was called
    await waitFor(() => {
      expect(firebaseAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'newuser@test.com',
        'SecurePass123!'
      );
    });
  });

  test('shows error when passwords do not match', async () => {
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <SignupScreen onSignupSuccess={() => {}} />
      </AuthProvider>
    );

    await user.type(screen.getByLabelText(/password/i), 'Password123!');
    await user.type(screen.getByLabelText(/confirm password/i), 'Different123!');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match|mismatch/i)).toBeInTheDocument();
    });
  });

  test('shows error on signup failure', async () => {
    const user = userEvent.setup();

    firebaseAuth.createUserWithEmailAndPassword.mockRejectedValue(
      new Error('Email already in use')
    );

    render(
      <AuthProvider>
        <SignupScreen onSignupSuccess={() => {}} />
      </AuthProvider>
    );

    await user.type(screen.getByLabelText(/email/i), 'existing@test.com');
    await user.type(screen.getByLabelText(/^password/i), 'Password123!');
    await user.type(screen.getByLabelText(/confirm password/i), 'Password123!');
    await user.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText(/already in use|error|failed/i)).toBeInTheDocument();
    });
  });
});