import React, { useState } from 'react';
import { login } from '../services/apiService';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
          const user = await login(email, password);
          setMessage(`Usuário logado com sucesso.`);
        } catch (error) {
          setMessage('Falha ao realizar o login do usuário.');
        }
      };

      return (
        <div className="container">
          <Link className="backButton" to="/">Voltar</Link>
          <div className="header">
            <h1>Login</h1>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="formGroup">
              <label>Email:</label>
              <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="formGroup">
              <label>Senha:</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button className="button" type="submit">Entrar</button>
          </form>
          {message && <p className="message">{message}</p>}
        </div>
      );
}

export default Login
