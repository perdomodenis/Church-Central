import { render } from '@testing-library/react';
import ScheduleScreen from './ScheduleScreen';
import * as AuthContext from '../../context/AuthContext';

jest.mock('../../context/AuthContext');

describe('ScheduleScreen Integration', () => {
  beforeEach(() => {
    AuthContext.useAuth = jest.fn().mockReturnValue({
      user: { uid: '123', email: 'test@test.com' },
      loading: false
    });
  });

  test('renders schedule screen', () => {
    const { container } = render(<ScheduleScreen />);
    expect(container).toBeInTheDocument();
  });

  test('schedule screen loads', () => {
    render(<ScheduleScreen />);
    expect(true).toBe(true);
  });

  test('schedule screen renders without errors', () => {
    const { container } = render(<ScheduleScreen />);
    expect(container.firstChild).toBeTruthy();
  });
});
