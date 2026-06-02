import { render, screen } from '@testing-library/react';
import Layout from './Layout';

describe('Layout Component', () => {
  
  test('renders layout container', () => {
    const { container } = render(
      <Layout>
        <p>Content</p>
      </Layout>
    );
    const layout = container.querySelector('.layout');
    expect(layout).toBeInTheDocument();
  });

  test('renders children content', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('contains header and footer sections', () => {
    const { container } = render(
      <Layout>
        <p>Main</p>
      </Layout>
    );
    const header = container.querySelector('header');
    const footer = container.querySelector('footer');
    
    expect(header).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

  test('wraps children in main content area', () => {
    const { container } = render(
      <Layout>
        <div className="content">Main Content</div>
      </Layout>
    );
    const mainArea = container.querySelector('.layout-main');
    expect(mainArea).toBeInTheDocument();
  });
});