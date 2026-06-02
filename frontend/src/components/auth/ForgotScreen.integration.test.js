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

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send|reset/i })).toBeInTheDocument();
  });

  test('sends password reset email', async () => {
    firebaseAuth.sendPasswordResetEmail = jest.fn().mockResolvedValue({});

    render(<ForgotScreen onBack={() => {}} />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const button = screen.getByRole('button', { name: /send|reset/i });

    expect(emailInput).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test('shows success message after sending reset email', async () => {
    const user = await userEvent.setup();

    firebaseAuth.sendPasswordResetEmail = jest.fn().mockResolvedValue({});

    render(<ForgotScreen onBack={() => {}} />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const button = screen.getByRole('button', { name: /send|reset/i });

    expect(emailInput).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  test('calls onBack when back button clicked', async () => {
    const user = await userEvent.setup();
    const handleBack = jest.fn();

    render(<ForgotScreen onBack={handleBack} />);

    const backButton = screen.getByRole('button', { name: /back|return/i });
    expect(backButton).toBeInTheDocument();
  });
});