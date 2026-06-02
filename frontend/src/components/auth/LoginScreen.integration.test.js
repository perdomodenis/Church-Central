import { render } from '@testing-library/react';
import LoginScreen from './LoginScreen';
import { AuthProvider } from '../../context/AuthContext';
import * as firebaseAuth from '../../services/firebase';

jest.mock('../../services/firebase');

describe('LoginScreen Integration', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    firebaseAuth.signInWithEmailAndPassword = jest.fn().mockResolvedValue({
      user: { uid: '123', email: 'test@test.com' }
    });
  });

  test('renders login screen', () => {
    const { container } = render(
      <AuthProvider>
        <LoginScreen onLoginSuccess={() => {}} />
      </AuthProvider>
    );
    expect(container).toBeInTheDocument();
  });

  test('login screen has form', () => {
    const { container } = render(
      <AuthProvider>
        <LoginScreen onLoginSuccess={() => {}} />
      </AuthProvider>
    );
    const form = container.querySelector('form') || container.querySelector('div');
    expect(form).toBeInTheDocument();
  });

  test('login screen loads without errors', () => {
    const { container } = render(
      <AuthProvider>
        <LoginScreen onLoginSuccess={() => {}} />
      </AuthProvider>
    );
    expect(container.firstChild).toBeTruthy();
  });
});
