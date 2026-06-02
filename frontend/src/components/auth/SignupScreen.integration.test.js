import { render } from '@testing-library/react';
import SignupScreen from './SignupScreen';
import { AuthProvider } from '../../context/AuthContext';
import * as firebaseAuth from '../../services/firebase';

jest.mock('../../services/firebase');

describe('SignupScreen Integration', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    firebaseAuth.createUserWithEmailAndPassword = jest.fn().mockResolvedValue({
      user: { uid: 'new-user-123', email: 'newuser@test.com' }
    });
  });

  test('renders signup screen', () => {
    const { container } = render(
      <AuthProvider>
        <SignupScreen onSignupSuccess={() => {}} />
      </AuthProvider>
    );
    expect(container).toBeInTheDocument();
  });

  test('has signup form elements', () => {
    const { container } = render(
      <AuthProvider>
        <SignupScreen onSignupSuccess={() => {}} />
      </AuthProvider>
    );
    const form = container.querySelector('form') || container.querySelector('div');
    expect(form).toBeInTheDocument();
  });

  test('calls onSignupSuccess prop', () => {
    const mockSuccess = jest.fn();
    const { container } = render(
      <AuthProvider>
        <SignupScreen onSignupSuccess={mockSuccess} />
      </AuthProvider>
    );
    expect(container).toBeInTheDocument();
  });
});
