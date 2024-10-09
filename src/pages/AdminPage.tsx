import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import '../styles/AdminPage.css';

interface DecodedToken {
  isAdmin: boolean;
  id: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  price: number; // Preço do item
}

interface Order {
  id: number;
  status: string;
  date: string; // ou Date
  totalPrice: number; // Adiciona a propriedade totalPrice
  items: OrderItem[]; // Supondo que cada ordem tem um array de itens
}

const AdminDashboard: React.FC = () => {
  const { token, logout } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [message, setMessage] = useState('');
  const [userIdInput, setUserIdInput] = useState('');
  const [userProductsIdInput, setUserProductsIdInput] = useState('');
  const [orderIdInput, setOrderIdInput] = useState('');
  const [visibleUsers, setVisibleUsers] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState(false);
  const [visibleOrder, setVisibleOrder] = useState(false);
  const [visibleUserDetails, setVisibleUserDetails] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setIsAdmin(decoded.isAdmin);

        if (!decoded.isAdmin) {
          navigate('/'); // Se não for admin, redireciona para a página inicial
        }
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
      }
    }
  }, [token, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      setMessage('');
      setVisibleUsers(true); // Exibe a lista de usuários
    } catch (error) {
      setMessage('Erro ao buscar usuários');
    }
  };

  const fetchUserById = async () => {
    if (!userIdInput) {
      setMessage('Por favor, insira um ID de usuário.');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:3001/users/${userIdInput}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserDetails(response.data);
      setVisibleUserDetails(true); // Exibe detalhes do usuário
      setMessage('');
    } catch (error) {
      setMessage('Erro ao buscar usuário');
    }
  };

  const fetchProductsByUserId = async () => {
    if (!userProductsIdInput) {
      setMessage('Por favor, insira um ID de usuário.');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:3001/productsByUserId/${userProductsIdInput}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
      setVisibleProducts(true); // Exibe produtos do usuário
      setMessage('');
    } catch (error) {
      setMessage('Erro ao buscar produtos');
    }
  };

  const fetchOrderById = async () => {
    if (!orderIdInput) {
      setMessage('Por favor, insira um ID de ordem.');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:3001/orders/${orderIdInput}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(response.data);
      setVisibleOrder(true); // Exibe detalhes da ordem
      setMessage('');
    } catch (error) {
      setMessage('Erro ao buscar ordem');
    }
  };

  const handleLogout = () => {
    logout(); // Chama a função logout
    navigate('/login'); // Redireciona para a página de login após o logout
  };

  if (!isAdmin) {
    return <p>Você não tem permissão para acessar esta página.</p>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Painel do Administrador</h1>

      <div className="admin-actions">
        {/* Listagem de Usuários */}
        <button onClick={fetchUsers}>Listagem de Usuários</button>
        {visibleUsers && (
          <div className="result-box">
            <h2>Lista de Usuários:</h2>
            <ul>
              {users.map((user) => (
                <li key={user.id}>
                  ID: {user.id}, Nome: {user.name}, Email: {user.email}
                </li>
              ))}
            </ul>
            <button onClick={() => setVisibleUsers(false)}>Ocultar</button>
          </div>
        )}

        {/* Verificar Usuário */}
        <button onClick={fetchUserById}>Verificar Usuário</button>
        <input
          type="text"
          placeholder="ID do Usuário"
          value={userIdInput}
          onChange={(e) => setUserIdInput(e.target.value)}
        />
        {visibleUserDetails && userDetails && (
          <div className="result-box">
            <h2>Detalhes do Usuário</h2>
            <p>ID: {userDetails.id}</p>
            <p>Nome: {userDetails.name}</p>
            <p>Email: {userDetails.email}</p>
            <button onClick={() => setVisibleUserDetails(false)}>Ocultar</button>
          </div>
        )}

        {/* Produtos por Usuário */}
        <button onClick={fetchProductsByUserId}>Produtos por Usuário</button>
        <input
          type="text"
          placeholder="ID do Usuário"
          value={userProductsIdInput}
          onChange={(e) => setUserProductsIdInput(e.target.value)}
        />
        {visibleProducts && (
          <div className="result-box">
            <h2>Produtos do Usuário</h2>
            <ul>
              {products.map((product) => (
                <li key={product.id}>
                  ID: {product.id}, Nome: {product.name}, Preço: R$ {product.price.toFixed(2)}
                </li>
              ))}
            </ul>
            <button onClick={() => setVisibleProducts(false)}>Ocultar</button>
          </div>
        )}

        {/* Verificar Ordem
        <input
          type="text"
          placeholder="ID da Ordem"
          value={orderIdInput}
          onChange={(e) => setOrderIdInput(e.target.value)}
        />
        <button onClick={fetchOrderById}>Verificar Ordem</button>
        {visibleOrder && order && (
          <div className="result-box">
            <h2>Detalhes da Ordem</h2>
            <p>ID: {order.id}</p>
            <p>Status: {order.status || "Não disponível"}</p>
            <p>Data: {order.date ? new Date(order.date).toLocaleDateString() : "Não disponível"}</p>
            <p>Preço Total: {order.totalPrice ? order.totalPrice.toFixed(2) + " USD" : "Não disponível"}</p>

            <h3>Itens da Ordem:</h3>
            <ul>
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <li key={item.id}>
                    {item.productName} - Quantidade: {item.quantity} - Preço: {item.price.toFixed(2)} USD
                  </li>
                ))
              ) : (
                <li>Nenhum item encontrado.</li>
              )}
            </ul>
            <button onClick={() => setVisibleOrder(false)}>Ocultar</button>
          </div>
        )} */}
      </div>

      {message && <p className="message">{message}</p>}

      <div className="footer">
        <button className="button logout-button" onClick={handleLogout}>Sair</button>
        <Link to="/" className="button link-button" style={{ textDecoration: 'none' }}>Voltar</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
