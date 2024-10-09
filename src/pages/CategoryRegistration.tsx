import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import '../styles/CategoryRegistration.css';

interface DecodedToken {
  id: number; 
}

const ProductRegistration: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { token } = useAuth(); // Obtenha o token de autenticação
  const navigate = useNavigate();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUserId(decoded.id);
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
      }
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !userId) {
      console.error('Autorização ou ID do usuário não encontrado');
      return;
    }

    const categoryData = {
      name,
      description: description || undefined, // Descrição opcional
    };

    try {
      await axios.post('http://localhost:3001/category/', categoryData, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      navigate('/profile'); // Redirecionar para o perfil após a criação do produto
    } catch (error) {
      console.error('Erro ao registrar o produto:', error);
    }
  };

  return (
    <div className="category-registration-page">
      <form className="registration-form" onSubmit={handleSubmit}>
        <h1>Criar Categoria</h1>
        
        <label>Nome:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Descrição (opcional):</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

        <button type="submit">Criar</button>

        <Link to="/profile">
          <button className="link-button">Voltar</button>
        </Link>
      </form>
    </div>
  );
};

export default ProductRegistration;
