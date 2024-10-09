import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/PaymentPage.css'; 

enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

const PaymentPage: React.FC = () => {
  const { token } = useAuth();
  const { orderId } = useParams<{ orderId: string }>();
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.PENDING);
  const [confirmationMessage, setConfirmationMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchPaymentStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3001/orders/${orderId}/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { status } = response.data;
      setPaymentStatus(status);
    } catch (error) {
      console.error('Erro ao buscar status do pagamento:', error);
      setPaymentStatus(PaymentStatus.FAILED);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchPaymentStatus();
    }
  }, [orderId]);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:3001/orders/${orderId}/payment`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const { paymentStatus } = response.data;
      if (paymentStatus === PaymentStatus.COMPLETED) {
        setConfirmationMessage('Pagamento realizado com sucesso!');
        setTimeout(() => navigate('/profile'), 2000);
      } else {
        setConfirmationMessage('Falha no pagamento. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      setConfirmationMessage('Erro ao processar pagamento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h1>Pagamento da Ordem</h1>
        <p>Order ID: {orderId}</p>

        {loading ? (
          <p className="loading-message">Carregando...</p>
        ) : (
          <h2 className="payment-status">Status do Pagamento: {paymentStatus}</h2>
        )}

        <button
          className="payment-button"
          onClick={handlePayment}
          disabled={loading}
        >
          Finalizar Pagamento
        </button>

        <Link to="/">
          <button className="back-button">Voltar</button>
        </Link>

        {confirmationMessage && (
          <p className="confirmation-message">{confirmationMessage}</p>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
