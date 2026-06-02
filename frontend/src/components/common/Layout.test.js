import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Layout from './Layout';

jest.mock('./Header', () => () => <header className="header">Header</header>);
jest.mock('./Footer', () => () => <footer className="footer">Footer</footer>);

describe('Layout Component', () => {
  
  test('renders layout container', () => {
    const { container } = render(
      <BrowserRouter>
        <Layout>
          <p>Content</p>
        </Layout>
      </BrowserRouter>
    );
    const layout = container.querySelector('.layout');
    expect(layout).toBeInTheDocument();
  });

  test('renders children content', () => {
    render(
      <BrowserRouter>
        <Layout>
          <div>Test Content</div>
        </Layout>
      </BrowserRouter>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  test('contains header and footer sections', () => {
    const { container } = render(
      <BrowserRouter>
        <Layout>
          <p>Main</p>
        </Layout>
      </BrowserRouter>
    );
    const header = container.querySelector('header');
    const footer = container.querySelector('footer');

    expect(header).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });

  test('wraps children in main content area', () => {
    const { container } = render(
      <BrowserRouter>
        <Layout>
          <div className="content">Main Content</div>
        </Layout>
      </BrowserRouter>
    );
    expect(screen.getByText('Main Content')).toBeInTheDocument();
  });
});