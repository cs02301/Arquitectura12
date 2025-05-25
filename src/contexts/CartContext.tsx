import React, { createContext, useContext, useState, useCallback } from 'react';
import { Book } from '../types/Book';
import { getMembershipDetails, applyDiscount } from '../services/membershipService';

interface CartItem {
  book: Book;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (book: Book) => Promise<void>;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  discountedTotal: number;
  membershipDiscount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [membershipDiscount, setMembershipDiscount] = useState(0);

  // Mock user ID - In a real app, this would come from authentication
  const userId = "1";

  const addToCart = useCallback(async (book: Book) => {
    try {
      // Fetch membership details when adding to cart
      const membership = await getMembershipDetails(userId);
      setMembershipDiscount(membership.discountPercentage);

      setItems(currentItems => {
        const existingItem = currentItems.find(item => item.book.id === book.id);
        
        if (existingItem) {
          return currentItems.map(item =>
            item.book.id === book.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        
        return [...currentItems, { book, quantity: 1 }];
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw new Error('Could not add item to cart');
    }
  }, [userId]);

  const removeFromCart = useCallback((bookId: string) => {
    setItems(currentItems => currentItems.filter(item => item.book.id !== bookId));
  }, []);

  const updateQuantity = useCallback((bookId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.book.id === bookId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setMembershipDiscount(0);
  }, []);

  const total = items.reduce(
    (sum, item) => sum + (item.book.numericPrice * item.quantity),
    0
  );

  const discountedTotal = applyDiscount(total, membershipDiscount);

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      total,
      discountedTotal,
      membershipDiscount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};