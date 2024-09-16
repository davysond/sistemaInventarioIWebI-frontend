import React, { useEffect, useState } from 'react';

const ConnectionCheck: React.FC = () => {
  const [status, setStatus] = useState<string>('Checking connection...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('http://localhost:3001/users'); // Ajuste para o endpoint correto
        if (response.ok) {
          setStatus('Connected!');
        } else {
          throw new Error('Failed to fetch');
        }
      } catch (error) {
        setStatus('Failed to connect to the API.');
        setError('Error: ' + (error as Error).message);
      }
    };

    checkConnection();
  }, []);

  return (
    <div>
      <h2>API Connection Status:</h2>
      <p>{status}</p>
      {error && <p>{error}</p>}
    </div>
  );
};

export default ConnectionCheck;
