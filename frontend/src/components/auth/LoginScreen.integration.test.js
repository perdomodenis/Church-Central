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
    const user = userEvent.setup();
    
    firebaseAuth.signInWithEmailAndPassword.mockResolvedValue({
      user: { uid: '123', email: 'test@test.com' }
    });

    render(
      <AuthProvider>
        <LoginScreen onLoginSuccess={() => {}} />
      </AuthProvider>
    );

    // Hohlt die form inputs und den submit button
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login|sign in/i });

    // Usergibt credentials ein und klickt auf Login
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
    const user = userEvent.setup();
        firebaseAuth.signInWithEmailAndPassword.mockRejectedValue(
        new Error('Invalid credentials')
    );
 render(
      <AuthProvider>
        <LoginScreen onLoginSuccess={() => {}} />
      </AuthProvider>
    );

    await user.type(screen.getByLabelText(/email/i), 'test@test.com');
    await user.type(screen.getByLabelText(/password/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials|failed|error/i)).toBeInTheDocument();
    });
  });
});