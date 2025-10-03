import { describe, it, expect } from 'vitest';
import { authReducer, loginSuccess, logout, AuthState } from './auth-slice';

describe('auth-slice', () => {
  it('should login and persist state', () => {
    const initial: AuthState = { token: null, role: null, isAuthenticated: false };
    const next = authReducer(initial, loginSuccess({ token: 't', role: 'admin' }));
    expect(next.isAuthenticated).toBe(true);
    expect(next.role).toBe('admin');
    expect(next.token).toBe('t');
  });

  it('should logout and clear token', () => {
    const initial: AuthState = { token: 't', role: 'admin', isAuthenticated: true };
    const next = authReducer(initial, logout());
    expect(next.isAuthenticated).toBe(false);
    expect(next.role).toBeNull();
    expect(next.token).toBeNull();
  });
});
