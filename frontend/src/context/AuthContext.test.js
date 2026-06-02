import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import * as firebase from '../services/firebase';

// Mock Firebase Modul
jest.mock('../services/firebase');

describe('useAuth Hook', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns null user and loading true initially', () => {
    firebase.onAuthStateChanged.mockImplementation((auth, callback) => {
      return () => {};  // gibt unsubscribe function zurück
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider  //wickelt hook mit dem Provider.
    });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  test('returns user when authenticated', async () => {
    const mockUser = { uid: '123', email: 'test@test.com' };
    
    firebase.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockUser);  // simuliert firebase calling mit dem user object
      return () => {};
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    await act(async () => {
      // wartet auf status änderung, damit der hook aktualisiert wird.
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.loading).toBe(false);
  });

  test('sets loading to false when auth state changes', async () => {
    firebase.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);  // User not authenticated
      return () => {};
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    await act(async () => {});

    expect(result.current.loading).toBe(false);
  });

  test('sets loading to false when auth state changes', async () => {
    firebase.onAuthStateChanged.mockImplementation((auth, callback) => {
      callback(null);  // User ist nicht authentifiziert
      return () => {};
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    await act(async () => {});

    expect(result.current.loading).toBe(false);
  });
});