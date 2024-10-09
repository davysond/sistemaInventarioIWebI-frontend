import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/LoginPage.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Redirecionar após a autenticação
  useEffect(() => {
    if (isAuthenticated) {
      // Se o usuário já estiver autenticado, redireciona com base em isAdmin
      if (isAdmin) {
        navigate('/admin'); // Redireciona para a página de admin se for admin
      } else {
        navigate('/profile'); // Caso contrário, redireciona para o perfil
      }
    }
  }, [isAuthenticated, isAdmin, navigate]); // Dependências incluídas

  const handleLogin = async () => {
    try {
      await login(email, password);
      // O redirecionamento já está sendo tratado no useEffect
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = () => {
    logout(); // Chama a função logout
    navigate('/login'); // Redireciona para a página de login após o logout
  };

  return (
    <div className="loginpage">
      <div className="login-container">
        {!isAuthenticated ? (
          <>
            <h1>Login</h1>
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                required
              />
              <button type="submit" className="login-button">Login</button>
              <Link to="/">
                <button className="link-button">Voltar</button>
              </Link> 
            </form>
          </>
        ) : (
          <div>
            <p>Você já está logado.</p>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
            <Link to="/">
              <button className="link-button">Voltar</button>
            </Link> 
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
