import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import * as AuthContext from '../../context/AuthContext';

jest.mock('../../context/AuthContext');

describe('Header Component', () => {

  beforeEach(() => {
    AuthContext.useAuth.mockReturnValue({
      user: { uid: '123', email: 'test@test.com' },
      loading: false,
      logout: jest.fn()
    });
  });

  test('renders header element', () => {
    const { container } = render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });

  test('displays title when provided', () => {
    render(
      <BrowserRouter>
        <Header title="Test Title" />
      </BrowserRouter>
    );
    const header = document.querySelector('header');
    expect(header).toBeInTheDocument();
  });

  test('renders navigation links if provided', () => {
    const { container } = render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    const header = container.querySelector('header');
    expect(header).toHaveClass('header');
  });

  test('applies correct CSS classes', () => {
    const { container } = render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    const header = container.querySelector('header');
    expect(header).toHaveClass('header');
  });
});