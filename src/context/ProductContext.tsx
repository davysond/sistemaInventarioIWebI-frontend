// ProductContext.tsx
import React, { createContext, useContext, useState } from 'react';

const ProductContext = createContext<{ productId: string | null; setProductId: (id: string) => void } | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [productId, setProductId] = useState<string | null>(null);

  return (
    <ProductContext.Provider value={{ productId, setProductId }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};
