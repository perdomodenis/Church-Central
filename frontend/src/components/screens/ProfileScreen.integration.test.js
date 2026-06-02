import ProfileScreen from './ProfileScreen';

describe('ProfileScreen Integration', () => {

  test('ProfileScreen component exists', () => {
    expect(ProfileScreen).toBeDefined();
  });

  test('ProfileScreen is a function', () => {
    expect(typeof ProfileScreen).toBe('function');
  });

  test('ProfileScreen can be imported', () => {
    expect(ProfileScreen.name).toBeTruthy();
  });
});
