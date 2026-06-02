import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ForgotScreen from './ForgotScreen';
import * as firebaseAuth from '../../services/firebase';

jest.mock('../../services/firebase');

describe('ForgotScreen Integration', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays email input and submit button', () => {
    render(<ForgotScreen onBack={() => {}} />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset|send/i })).toBeInTheDocument();
  });

  test('sends password reset email', async () => {
    const user = userEvent.setup();

    firebaseAuth.sendPasswordResetEmail = jest.fn().mockResolvedValue({});

    render(<ForgotScreen onBack={() => {}} />);

    await user.type(screen.getByLabelText(/email/i), 'user@test.com');
    await user.click(screen.getByRole('button', { name: /reset|send/i }));

    await waitFor(() => {
      expect(firebaseAuth.sendPasswordResetEmail).toHaveBeenCalled();
    });
  });

  test('shows success message after sending reset email', async () => {
    const user = userEvent.setup();

    firebaseAuth.sendPasswordResetEmail = jest.fn().mockResolvedValue({});

    render(<ForgotScreen onBack={() => {}} />);

    await user.type(screen.getByLabelText(/email/i), 'user@test.com');
    await user.click(screen.getByRole('button', { name: /reset|send/i }));

    await waitFor(() => {
      expect(screen.getByText(/check.*email|sent.*reset/i)).toBeInTheDocument();
    });
  });

  test('calls onBack when back button clicked', async () => {
    const user = userEvent.setup();
    const handleBack = jest.fn();

    render(<ForgotScreen onBack={handleBack} />);

    await user.click(screen.getByRole('button', { name: /back|return/i }));
    expect(handleBack).toHaveBeenCalled();
  });
});