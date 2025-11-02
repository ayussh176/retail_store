import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'customer' | 'retailer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>(undefined!);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    // Mock login - replace with Oracle SQL Plus connection
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    const user = users.find((u: any) => 
      u.email === email && 
      u.password === password && 
      u.role === role
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const loggedInUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
  };

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    const existingUser = users.find((u: any) => u.email === email && u.role === role);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser = {
      id: crypto.randomUUID(),
      email,
      password,
      name,
      role,
    };

    users.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(users));

    const loggedInUser = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    };

    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Removed localStorage.removeItem('cart') - cart is now managed by backend
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
