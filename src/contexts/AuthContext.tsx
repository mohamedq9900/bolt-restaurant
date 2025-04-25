import { createContext, useContext, useState, ReactNode } from 'react';

// Admin types
type Admin = {
  id: string;
  username: string;
};

// AuthContext types
type AuthContextType = {
  admin: Admin | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  admin: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
});

// Hook for using auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [admin, setAdmin] = useState<Admin | null>(() => {
    // Check if admin is already logged in
    const savedAdmin = localStorage.getItem('admin');
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });

  // In a real application, this would make an API call to authenticate
  const login = async (username: string, password: string): Promise<boolean> => {
    // Mock authentication - in a real app, this would be an API call
    if (username === 'admin' && password === 'password123') {
      const adminData = {
        id: '1',
        username: 'admin',
      };
      setAdmin(adminData);
      localStorage.setItem('admin', JSON.stringify(adminData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin');
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isAuthenticated: admin !== null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};