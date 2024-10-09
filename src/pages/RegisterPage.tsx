import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/RegisterPage.css';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/users/createUser', { name, email, password });
      navigate('/login'); 
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  return (
    <div className="registerpage">
      <div className="register-container">
        <h1>Cadastrar</h1>
        <form onSubmit={handleSubmit}>
          <label>Nome:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="register-input" 
            required 
          />
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="register-input" 
            required 
          />
          <label>Senha:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="register-input" 
            required 
          />
          <button type="submit" className="register-button">Cadastrar</button>
        </form>
        <Link to="/">
          <button className="link-button">Voltar</button>
        </Link> 
      </div>
    </div>
  );
};

export default RegisterPage;
