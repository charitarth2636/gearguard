import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for stored user on mount
  // Check for stored user on mount
  useEffect(() => {
    // const storedUser = localStorage.getItem('gearguard_user');
    // if (storedUser) {
    //   setUser(JSON.parse(storedUser));
    // }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Fetch users from JSON Server
      const response = await axios.get('http://localhost:5000/users');
      const users = response.data;

      // Find matching user
      const foundUser = users.find(
        u => u.email === email && u.password === password
      );

      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      // Store user (without password)
      const userWithoutPassword = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      };

      setUser(userWithoutPassword);
      localStorage.setItem('gearguard_user', JSON.stringify(userWithoutPassword));

      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const signup = async (name, email, password) => {
    try {
      // Check if user already exists
      const checkResponse = await axios.get('http://localhost:5000/users');
      const existingUser = checkResponse.data.find(u => u.email === email);

      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Create new user
      const newUser = {
        id: `user${Date.now()}`,
        name,
        email,
        password,
        role: 'technician',
        createdAt: new Date().toISOString(),
      };

      const response = await axios.post('http://localhost:5000/users', newUser);

      // Store user (without password)
      const userWithoutPassword = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
      };

      setUser(userWithoutPassword);
      localStorage.setItem('gearguard_user', JSON.stringify(userWithoutPassword));

      return { success: true };
    } catch (error) {
      throw new Error(error.message || 'Signup failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gearguard_user');
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
