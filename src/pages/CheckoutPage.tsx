import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { CreditCard, AlertCircle } from 'lucide-react';
import { makePurchaseApi } from '../services/purchaseService';
import { getMembershipCard, checkBalance, applyDiscount } from '../services/membershipService';
import type { MembershipCard } from '../services/membershipService';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const [membershipCard, setMembershipCard] = useState<MembershipCard | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMembershipCard = async () => {
      try {
        setIsLoading(true);
        const card = await getMembershipCard(1); // ID de Juan Pérez
        setMembershipCard(card);
      } catch (err) {
        setError('Error cargando datos de membresía');
        console.error('Error loading membership card:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadMembershipCard();
  }, []);

  const discountedTotal = applyDiscount(total);
  
  const handlePurchase = async () => {
    if (!membershipCard) {
      setError('Tarjeta de membresía no disponible');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const currentBalance = await checkBalance(membershipCard.cardId);
      if (currentBalance < discountedTotal) {
        throw new Error('Saldo insuficiente en la tarjeta');
      }

      const purchaseData = {
        userId: membershipCard.userId,
        cardId: membershipCard.cardId,
        books: items.map(item => ({
          bookId: parseInt(item.book.id),
          quantity: item.quantity
        }))
      };

      await makePurchaseApi(purchaseData);
      clearCart();
      navigate('/order-approved');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error procesando la compra');
      }
      console.error('Purchase error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !membershipCard) {
    return (
      <div className="page-transition flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#7c6a9a] mx-auto mb-4"></div>
          <p>Cargando datos de membresía...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-transition max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-6">Finalizar Compra</h1>

        {/* Resumen del carrito */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Resumen de la Compra</h2>
          {items.map(item => (
            <div key={item.book.id} className="flex justify-between py-2">
              <span>{item.book.title} (x{item.quantity})</span>
              <span>{(item.book.numericPrice * item.quantity).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
            </div>
          ))}
        </div>

        {/* Información de la tarjeta */}
        {membershipCard && (
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4">Tarjeta de Membresía</h2>
            <div className="bg-gradient-to-r from-[#7c6a9a] to-[#9d8fbb] text-white p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span>Número de Tarjeta</span>
                <span>{membershipCard.cardNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Saldo Disponible</span>
                <span>{membershipCard.balance.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
              </div>
            </div>
          </div>
        )}

        {/* Total y descuento */}
        <div className="mb-6">
          <div className="flex justify-between py-2">
            <span>Subtotal</span>
            <span>{total.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
          </div>
          <div className="flex justify-between py-2 text-green-600">
            <span>Descuento Membresía (10%)</span>
            <span>-{(total - discountedTotal).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
          </div>
          <div className="flex justify-between py-2 font-semibold text-lg">
            <span>Total a Pagar</span>
            <span>{discountedTotal.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="mr-2" size={20} />
            {error}
          </div>
        )}

        <button
          onClick={handlePurchase}
          disabled={isLoading || items.length === 0}
          className={`w-full btn-primary py-3 flex items-center justify-center gap-2 ${
            (isLoading || items.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <CreditCard size={20} />
          {isLoading ? 'Procesando...' : 'Confirmar Compra'}
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;