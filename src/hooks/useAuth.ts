import { useState, useEffect } from 'react';
import { AuthState } from '../types';

const AUTH_KEY = 'smart_file_tracking_auth';

export function useAuth() {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem(AUTH_KEY);
    return saved ? JSON.parse(saved) : { isAuthenticated: false, user: null };
  });

  const login = (username: string) => {
    const newState = { isAuthenticated: true, user: username };
    setAuth(newState);
    localStorage.setItem(AUTH_KEY, JSON.stringify(newState));
  };

  const logout = () => {
    const newState = { isAuthenticated: false, user: null };
    setAuth(newState);
    localStorage.removeItem(AUTH_KEY);
  };

  return { ...auth, login, logout };
}
