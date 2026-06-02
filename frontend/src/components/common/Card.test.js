import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card Component', () => {
  
  test('renders children content', () => {
    render(
      <Card>
        <p>Test content</p>
      </Card>
    );
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  test('displays title when provided', () => {
    render(
      <Card title="Card Title">
        Content
      </Card>
    );
    expect(screen.getByText('Card Title')).toBeInTheDocument();
  });

  test('does not display title when not provided', () => {
    const { container } = render(
      <Card>Content</Card>
    );
    const title = container.querySelector('.card-title');
    expect(title).not.toBeInTheDocument();
  });

  test('displays footer when provided', () => {
    render(
      <Card footer={<div>Footer Content</div>}>
        Main
      </Card>
    );
    expect(screen.getByText('Footer Content')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    const { container } = render(
      <Card className="custom-class">
        Content
      </Card>
    );
    const card = container.querySelector('.card');
    expect(card).toHaveClass('custom-class');
  });
});