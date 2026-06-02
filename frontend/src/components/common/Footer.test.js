import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer Component', () => {
  
  test('renders footer element', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });

  test('displays copyright text', () => {
    render(<Footer />);
    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(year.toString()))).toBeInTheDocument();
  });

  test('contains required links', () => {
    render(<Footer />);
    expect(screen.getByText(/privacy|policy|contact/i)).toBeInTheDocument();
  });

  test('applies footer-specific styling', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('footer');
  });
});