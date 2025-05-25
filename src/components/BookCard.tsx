import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import { Book } from '../types/Book';
import { useCart } from '../contexts/CartContext';
import { checkInventory } from '../services/membershipService';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to book details
    setIsLoading(true);
    setError(null);

    try {
      // Check inventory before adding to cart
      const stock = await checkInventory(book.id);
      if (stock <= 0) {
        setError('This book is out of stock');
        return;
      }

      await addToCart(book);
    } catch (error) {
      setError('Error adding to cart');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link to={`/book/${book.id}`} className="block">
      <div className="card book-card-animation h-full">
        <div className="relative pb-[140%] overflow-hidden group">
          <img 
            src={book.coverImage} 
            alt={book.title} 
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="bg-white text-gray-800 px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <ShoppingCart size={16} />
              <span>{isLoading ? 'Adding...' : 'Add to Cart'}</span>
            </button>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-sm line-clamp-2 mb-1">{book.title}</h3>
          <p className="text-gray-600 text-xs">{book.author}</p>
          <p className="text-[#7c6a9a] font-medium mt-2">{book.price}</p>
          {error && (
            <div className="mt-2 text-red-500 text-xs flex items-center">
              <AlertCircle size={12} className="mr-1" />
              {error}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BookCard;