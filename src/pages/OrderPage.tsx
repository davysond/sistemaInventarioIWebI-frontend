import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import { useAuth } from '../context/AuthContext';
import '../styles/OrderPage.css';

interface Product {
  id: number;
  name: string;
  price: number;
}

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

const OrderPage: React.FC = () => {
  const { token } = useAuth();
  const { productId } = useParams<{ productId: string }>(); 
  const [product, setProduct] = useState<Product | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CREDIT_CARD);
  const [userId, setUserId] = useState<number | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUserId(decoded.id);
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
      }
    } else {
      console.error('Token não encontrado. O usuário não está autenticado.');
    }
  }, [token]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        try {
          const response = await axios.get(`http://localhost:3001/products/${productId}`);
          setProduct(response.data);
        } catch (error) {
          console.error('Erro ao carregar o produto:', error);
          setConfirmationMessage('Produto não encontrado.');
        }
      } else {
        console.error('ID do produto não encontrado na URL');
        setConfirmationMessage('ID do produto não encontrado na URL.');
      }
    };

    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      console.error('Token de autorização não encontrado.');
      return;
    }

    if (!userId) {
      console.error('ID do usuário não encontrado.');
      return;
    }

    if (!product) {
      console.error('Produto não encontrado.');
      return;
    }

    const orderData = {
      userId,
      paymentMethod,
      orderItems: [{ productId: product.id, quantity: 1 }],
    };

    try {
      const response = await axios.post(`http://localhost:3001/orders/${productId}`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const orderId = response.data.id;
      localStorage.setItem('orderId', orderId.toString());
      setOrderId(orderId);
      setConfirmationMessage('Ordem criada com sucesso! Agora finalize o pagamento.');

      // Redireciona para a página de finalização de pagamento
      navigate(`/orders/${orderId}/payment`);

    } catch (error) {
      console.error('Erro ao criar ordem:', error);
      setConfirmationMessage('Erro ao criar ordem. Tente novamente.');
    }
  };

  return (
    <div className="order-page">
      <div className="order-container">
        <h1>Ordem de Compra</h1>

        {product ? (
          <div>
            <p>Produto: {product.name}</p>
            <p>Preço: R${product.price.toFixed(2)}</p>
          </div>
        ) : (
          <p>Carregando produto...</p>
        )}

        <h2>Método de Pagamento:</h2>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}>
          <option value={PaymentMethod.CREDIT_CARD}>Cartão de Crédito</option>
          <option value={PaymentMethod.DEBIT_CARD}>Cartão de Débito</option>
          <option value={PaymentMethod.PAYPAL}>PayPal</option>
          <option value={PaymentMethod.PIX}>PIX</option>
          <option value={PaymentMethod.CASH}>Dinheiro</option>
        </select>

        <button type="submit" className="order-button" onClick={handleSubmit}>Criar Ordem</button>
        <Link to="/">
          <button className="link-button">Voltar</button>
        </Link>

        {confirmationMessage && <p className="confirmation-message">{confirmationMessage}</p>}
      </div>
    </div>
  );
};

export default OrderPage;
