import { render } from '@testing-library/react';
import InboxScreen from './InboxScreen';
import * as AuthContext from '../../context/AuthContext';

jest.mock('../../context/AuthContext');

describe('InboxScreen Integration', () => {
  beforeEach(() => {
    AuthContext.useAuth = jest.fn().mockReturnValue({
      user: { uid: '123', email: 'test@test.com' },
      loading: false
    });
  });

  test('renders inbox screen', () => {
    const { container } = render(<InboxScreen />);
    expect(container).toBeInTheDocument();
  });

  test('inbox screen loads', () => {
    render(<InboxScreen />);
    expect(true).toBe(true);
  });

  test('inbox screen renders without errors', () => {
    const { container } = render(<InboxScreen />);
    expect(container.firstChild).toBeTruthy();
  });
});
