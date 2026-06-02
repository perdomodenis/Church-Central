import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header Component', () => {
  
  test('renders header element', () => {
    const { container } = render(<Header />);
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });

  test('displays title when provided', () => {
    render(<Header title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  test('renders navigation links if provided', () => {
    const links = [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' }
    ];
    render(<Header links={links} />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  test('applies correct CSS classes', () => {
    const { container } = render(<Header />);
    const header = container.querySelector('header');
    expect(header).toHaveClass('header');
  });
});