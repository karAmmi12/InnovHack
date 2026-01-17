import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "@/types/product";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  lastAddedProduct: Product | null;
  clearLastAdded: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [lastAddedProduct, setLastAddedProduct] = useState<Product | null>(null);

  const addToCart = (product: Product) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setLastAddedProduct(product);
    
    // Auto-clear the notification after 2 seconds
    setTimeout(() => {
      setLastAddedProduct(null);
    }, 2000);
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearLastAdded = () => {
    setLastAddedProduct(null);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, itemCount, addToCart, removeFromCart, lastAddedProduct, clearLastAdded }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
