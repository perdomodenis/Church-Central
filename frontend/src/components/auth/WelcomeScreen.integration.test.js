import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WelcomeScreen from './WelcomeScreen';

describe('WelcomeScreen Integration', () => {
  
  test('displays welcome message and buttons', () => {
    render(
      <WelcomeScreen 
        onLogin={() => {}} 
        onSignup={() => {}} 
      />
    );

    expect(screen.getByText(/welcome|church central/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login|sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /signup|sign up|create account/i })).toBeInTheDocument();
  });

  test('calls onLogin when login button clicked', async () => {
    const user = userEvent.setup();
    const handleLogin = jest.fn();

    render(
      <WelcomeScreen 
        onLogin={handleLogin} 
        onSignup={() => {}} 
      />
    );

    await user.click(screen.getByRole('button', { name: /login/i }));
    expect(handleLogin).toHaveBeenCalled();
  });

  test('calls onSignup when signup button clicked', async () => {
    const user = userEvent.setup();
    const handleSignup = jest.fn();

    render(
      <WelcomeScreen 
        onLogin={() => {}} 
        onSignup={handleSignup} 
      />
    );

    await user.click(screen.getByRole('button', { name: /signup/i }));
    expect(handleSignup).toHaveBeenCalled();
  });
});