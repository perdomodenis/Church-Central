import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ForgotScreen from './ForgotScreen';

describe('ForgotScreen Integration', () => {

  test('displays email input and submit button', () => {
    render(<ForgotScreen onBack={() => {}} onSent={() => {}} />);

    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  test('calls onSent when form is submitted with email', async () => {
    const handleSent = jest.fn();
    render(<ForgotScreen onBack={() => {}} onSent={handleSent} />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const button = screen.getByRole('button', { name: /send/i });

    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.click(button);

    expect(handleSent).toHaveBeenCalledWith('test@example.com');
  });

  test('calls onBack when back button clicked', async () => {
    const handleBack = jest.fn();
    render(<ForgotScreen onBack={handleBack} onSent={() => {}} />);

    const backButton = screen.getByRole('button', { name: /back/i });
    await userEvent.click(backButton);

    expect(handleBack).toHaveBeenCalledTimes(1);
  });
});