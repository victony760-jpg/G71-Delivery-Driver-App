import { useState, useCallback, useMemo } from 'react';
import {
  ROLES,
  STORAGE_KEYS,
  TOKEN_TTL_HOURS,
} from '../utils/constants';
import api from '../services/api';
import AuthContext from './authContext';

function safeParse(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => safeParse(STORAGE_KEYS.USER));
  const [token, setToken] = useState(() =>
    localStorage.getItem(STORAGE_KEYS.TOKEN),
  );
  const [loading, setLoading] = useState(false);

  const persistSession = useCallback((userObj, jwt) => {
    const exp = Date.now() + TOKEN_TTL_HOURS * 3600 * 1000;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userObj));
    localStorage.setItem(STORAGE_KEYS.TOKEN, jwt);
    localStorage.setItem(STORAGE_KEYS.TOKEN_EXP, String(exp));
    setUser(userObj);
    setToken(jwt);
  }, []);

  const login = useCallback(
    async (email, password) => {
      setLoading(true);
      try {
        const cleanEmail = String(email).trim().toLowerCase();
        const cleanPass = String(password).trim();

        if (!cleanEmail || !cleanPass) {
          throw new Error('Email and password required');
        }

        const { data } = await api.post('/auth/login', {
          email: cleanEmail,
          password: cleanPass,
        });
        const authenticatedUser = data?.user || {
          id: data?._id,
          _id: data?._id,
          name: data?.name,
          email: data?.email,
          role: data?.role,
          city: data?.city,
          avatarUrl: data?.avatarUrl,
          mustChangePassword: data?.mustChangePassword,
        };
        if (!authenticatedUser?.role || !data?.token) {
          throw new Error('Invalid server response');
        }
        persistSession(authenticatedUser, data.token);
        return authenticatedUser;
      } finally {
        setLoading(false);
      }
    },
    [persistSession],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.TOKEN_EXP);
    setUser(null);
    setToken(null);
    window.location.href = '/login';
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isLoading: loading,
      login,
      logout,
      isAuthenticated: !!token && !!user,
      isAdmin: user?.role === ROLES.ADMIN,
      isDriver: user?.role === ROLES.DRIVER,
    }),
    [user, token, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
