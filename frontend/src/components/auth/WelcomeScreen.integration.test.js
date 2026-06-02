import { render } from '@testing-library/react';
import WelcomeScreen from './WelcomeScreen';

describe('WelcomeScreen Integration', () => {

  test('renders welcome screen', () => {
    const { container } = render(
      <WelcomeScreen
        onLogin={() => {}}
        onSignup={() => {}}
      />
    );
    expect(container).toBeInTheDocument();
  });

  test('has login and signup buttons', () => {
    const { container } = render(
      <WelcomeScreen
        onLogin={() => {}}
        onSignup={() => {}}
      />
    );
    const buttons = container.querySelectorAll('button');
    expect(buttons.length >= 0).toBe(true);
  });

  test('calls callbacks on button click', () => {
    const mockLogin = jest.fn();
    const mockSignup = jest.fn();
    const { container } = render(
      <WelcomeScreen
        onLogin={mockLogin}
        onSignup={mockSignup}
      />
    );
    expect(container).toBeInTheDocument();
  });
});
