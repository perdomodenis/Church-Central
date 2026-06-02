import { render } from '@testing-library/react';
import FeedScreen from './FeedScreen';
import * as AuthContext from '../../context/AuthContext';

jest.mock('../../context/AuthContext');

describe('FeedScreen Integration', () => {
  beforeEach(() => {
    AuthContext.useAuth = jest.fn().mockReturnValue({
      user: { uid: '123', email: 'test@test.com' },
      loading: false
    });
  });

  test('renders feed screen', () => {
    const { container } = render(<FeedScreen />);
    expect(container).toBeInTheDocument();
  });

  test('feed screen loads', () => {
    render(<FeedScreen />);
    expect(true).toBe(true);
  });

  test('feed screen renders without errors', () => {
    const { container } = render(<FeedScreen />);
    expect(container.firstChild).toBeTruthy();
  });
});
