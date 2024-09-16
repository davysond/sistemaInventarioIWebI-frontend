import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css'; // Importa o CSS para esta página
import ConnectionCheck from '../components/ConnectionCheck';

const HomePage: React.FC = () => {
  return (
    <div className="container">
      <div className="header">
        <h1>Sistema de Inventário - Web I</h1>
        <div className="buttonGroup">
          <Link className="linkButton" to="/login">Login</Link>
          <Link className="linkButton" to="/register-user">Cadastrar Usuário</Link>
          <Link className="linkButton" to="/register-product">Cadastrar Produto</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
