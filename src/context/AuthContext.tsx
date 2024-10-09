import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthContextType } from '../types/AuthContextType';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const login = async (email: string, password: string) => {
    const response = await fetch('http://localhost:3001/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('O seu login falhou. Tente novamente, por gentileza!'); // Lidar com erros de login
    }

    const data = await response.json();
    const decodedToken = jwtDecode<{ isAdmin: boolean }>(data.token); // Decodifica o token para obter isAdmin

    setToken(data.token);
    setIsAdmin(decodedToken.isAdmin); // Define isAdmin baseado no token
    localStorage.setItem('token', data.token); // Salva o token no localStorage
  };

  const logout = () => {
    setToken(null);
    setIsAdmin(false); // Reseta isAdmin ao sair
    localStorage.removeItem('token'); // Remove o token do localStorage
  };

  const isAuthenticated = !!token;

  // Função para restaurar sessão com o token do localStorage
  const restoreSession = (storedToken: string) => {
    const decodedToken = jwtDecode<{ isAdmin: boolean }>(storedToken); // Decodifica o token armazenado
    setToken(storedToken); // Define o token
    setIsAdmin(decodedToken.isAdmin); // Define isAdmin baseado no token armazenado
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      restoreSession(storedToken); // Restaura sessão automaticamente
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, login, logout, isAuthenticated, restoreSession, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
