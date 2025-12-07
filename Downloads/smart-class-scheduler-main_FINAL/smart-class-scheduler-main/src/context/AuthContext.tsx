import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '@/types';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole, department: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:5000';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast({ title: 'Login Failed', description: err.message || 'Invalid credentials', variant: 'destructive' });
        setIsLoading(false);
        return false;
      }
      const data = await res.json();
      const returnedUser: User = data.user;
      setUser(returnedUser);
      localStorage.setItem('user', JSON.stringify(returnedUser));
      toast({ title: 'Login Successful', description: `Welcome back, ${returnedUser.name}!` });
      setIsLoading(false);
      return true;
    } catch (error: any) {
      toast({ title: 'Login Error', description: error.message || 'Network error', variant: 'destructive' });
      setIsLoading(false);
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    department: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, department }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast({ title: 'Registration Failed', description: err.message || 'Unable to register', variant: 'destructive' });
        setIsLoading(false);
        return false;
      }
      const data = await res.json();
      const newUser: User = data.user;
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      toast({ title: 'Registration Successful', description: 'Your account has been created!' });
      setIsLoading(false);
      return true;
    } catch (error: any) {
      toast({ title: 'Registration Error', description: error.message || 'Network error', variant: 'destructive' });
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({ title: 'Logged Out', description: 'You have been logged out successfully.' });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
