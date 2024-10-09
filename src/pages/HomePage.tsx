import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Product } from '../types/ProductType';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import '../styles/HomePage.css';

enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  PAYPAL = 'PAYPAL',
  PIX = 'PIX',
  CASH = 'CASH',
}

interface DecodedToken {
  id: number;
  isAdmin: boolean;
}

const HomePage: React.FC = () => {
  const { token, restoreSession } = useAuth(); // Token de autenticação
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Estado de carregamento
  const [error, setError] = useState<string | null>(null); // Estado de erro
  const [userId, setUserId] = useState<number | null>(null); // ID do usuário logado
  const navigate = useNavigate();

  // Recupera o token do localStorage ao carregar a página
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      restoreSession(storedToken); // Usa a nova função para restaurar a sessão
    } else {
      navigate('/'); // Redireciona para login se não tiver token
    }
  }, [navigate, restoreSession]);

  // Recupera o ID do usuário logado a partir do token
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUserId(decoded.id); // Define o ID do usuário a partir do token decodificado
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
      }
    }
  }, [token]);

  // Buscar os produtos disponíveis
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/products'); // Sem autenticação
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products', error);
        setError('Erro ao carregar produtos. Tente novamente mais tarde.'); // Mensagem de erro
      } finally {
        setLoading(false); // Finaliza o carregamento
      }
    };

    fetchProducts(); // Chama a função para buscar produtos
  }, []);

  return (
    <div className="homepage">
      <div className="header-container">
        <h1 className="homepage-header">Bem-vindo ao Sistema de Inventário Web I, usuário.</h1>
        <div className="navigation">
        <Link to="/register" className="nav-link">Cadastre-se</Link>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/profile" className="nav-link">Perfil</Link>
        </div>
      </div>

      <h2>Produtos Disponíveis:</h2>
      {loading && <p className="loading">Carregando produtos...</p>} {/* Mensagem de carregamento */}
      {error && <p className="error">{error}</p>} {/* Mensagem de erro */}
      <ul className="product-list">
        {products.map(product => (
          <li key={product.id} className="product-item">
            <div className="product-info">
              {product.name} - R${product.price.toFixed(2)}
              <button className="buy-button" onClick={() => navigate(`/createOrderByProductId/${product.id}`)}>
                Comprar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
