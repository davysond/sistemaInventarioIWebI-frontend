import React, { useState } from 'react';
import { createProduct } from '../services/apiService';
import '../styles/RegisterProduct.css';
import { Link } from 'react-router-dom';

const RegisterProduct: React.FC = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const product = await createProduct(name, parseFloat(price), description);
      setMessage('Produto criado com sucesso.');
    } catch (error) {
      setMessage('Falha na criação do produto.');
    }
  };

  return (
    <div className="container">
      <div className="header">
        <Link className="backButton" to="/">Voltar</Link>
        <h1>Registro de Produto</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <label>Nome do Produto:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="formGroup">
          <label>Preço:</label>
          <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>
        <div className="formGroup">
          <label>Descrição:</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <button className="button" type="submit">Criar Produto</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default RegisterProduct;
