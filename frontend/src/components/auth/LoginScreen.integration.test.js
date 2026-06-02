import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginScreen from './LoginScreen';
import { AuthProvider } from '../../context/AuthContext';
import * as firebaseAuth from '../../services/firebase';

jest.mock('../../services/firebase');

describe('LoginScreen Integration', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('complete login flow', async () => {
    const user = await userEvent.setup();

    firebaseAuth.signInWithEmailAndPassword.mockResolvedValue({
      user: { uid: '123', email: 'test@test.com' }
    });

    render(
      <AuthProvider>
        <LoginScreen onLoginSuccess={() => {}} />
      </AuthProvider>
    );

    const emailInput = screen.getByPlaceholderText(/email/i) || screen.getByDisplayValue('');
    const passwordInput = screen.getByPlaceholderText(/password/i) || screen.getByDisplayValue('');
    const submitButton = screen.getByRole('button', { name: /login|sign in/i });

    await user.type(emailInput, 'test@test.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    // Wartet auf das Login fertig wird.
    await waitFor(() => {
      expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
        expect.anything(),
        'test@test.com',
        'password123'
      );
    });
  });

    test('shows error message on login failure', async () => {
    const user = await userEvent.setup();
        firebaseAuth.signInWithEmailAndPassword.mockRejectedValue(
        new Error('Invalid credentials')
    );
 render(
      <AuthProvider>
        <LoginScreen onLoginSuccess={() => {}} />
      </AuthProvider>
    );

    const emailInput = screen.getByPlaceholderText(/email/i) || screen.getByDisplayValue('');
    const passwordInput = screen.getByPlaceholderText(/password/i) || screen.getByDisplayValue('');
    await user.type(emailInput, 'test@test.com');
    await user.type(passwordInput, 'wrong');
        await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials|failed|error/i)).toBeInTheDocument();
    });
  });
});