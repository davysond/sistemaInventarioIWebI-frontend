import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/UserProfilePage.css';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface DecodedToken {
  id: number; 
  isAdmin: boolean;
}

const UserProfilePage: React.FC = () => {
  const { token, logout } = useAuth(); 
  const [products, setProducts] = useState<Product[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const navigate = useNavigate();

  // Verifica se o usuário está logado
  useEffect(() => {
    if (!token) {
      navigate('/login'); // Redireciona para a página de login se não estiver logado
    }
  }, [token, navigate]);

  // Verifica se o usuário é admin
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token); 
        console.log('Decoded token:', decoded);
        setUserId(decoded.id); 
        setIsAdmin(decoded.isAdmin); // Define se o usuário é admin
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
      }
    }
  }, [token]);

  useEffect(() => {
    // Redireciona para a página de admin se o usuário for admin
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  const deleteProduct = async (productId: number) => {
    try {
      await axios.delete(`http://localhost:3001/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((product) => product.id !== productId)); // Remove o produto deletado da lista
      console.log('Produto deletado com sucesso.');
    } catch (error) {
      console.error('Erro ao deletar o produto:', error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (userId) {
        try {
          const response = await axios.get(`http://localhost:3001/productsByUserId/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('Produtos retornados:', response.data); 
          setProducts(response.data);
        } catch (error) {
          console.error('Erro ao buscar produtos:', error);
        }
      }
    };

    fetchProducts();
  }, [token, userId]);

  const handleLogout = () => {
    logout(); // Chama a função logout
    navigate('/login'); // Redireciona para a página de login após o logout
  };

  return (
    <div className="user-profile-page">
      <div className="profile-container">
        <h1>Meu Perfil</h1>
        <h2>Meus Produtos</h2>
        {products.length > 0 ? (
          <ul>
            {products.map((product) => (
              <li key={product.id}>
                {product.name} - R${product.price.toFixed(2)}{' '}
                <button className="delete-button" onClick={() => deleteProduct(product.id)}>Deletar</button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-products-message">Você não tem produtos cadastrados.</p>
        )}
        <div>
          <Link to="/createProduct">
            <button className="create-button">Criar Produto</button>
          </Link>
          <Link to="/createCategory">
            <button className="create-button">Criar Categoria</button>
          </Link>
          <Link to="/">
            <button className="back-button">Voltar</button>
          </Link>
          <button className="logout-button" onClick={handleLogout}>Sair</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
