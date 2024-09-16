import React, { useState } from 'react';
import { createUser } from '../services/apiService';
import '../styles/RegisterUser.css';
import { Link } from 'react-router-dom';

const RegisterUser: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const user = await createUser(name, email, password);
      setMessage(`Usuário criado com sucesso.`);
    } catch (error) {
      setMessage('Falha na criação do usuário.');
    }
  };

  return (
    <div className="container">
      <div className="header">
        <Link className="backButton" to="/">Voltar</Link>
        <h1>Registro de Usuário</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <label>Nome:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="formGroup">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="formGroup">
          <label>Senha:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="button" type="submit">Criar</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default RegisterUser;
