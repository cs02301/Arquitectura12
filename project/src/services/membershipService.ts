// Servicio para manejar membresías y descuentos
const API_BASE_URL = '/api';

export interface MembershipDetails {
  cardId: number;
  balance: number;
  discountPercentage: number;
  status: 'active' | 'inactive';
}

export const getMembershipDetails = async (userId: string): Promise<MembershipDetails> => {
  try {
    const response = await fetch(`${API_BASE_URL}/membership-cards/user/${userId}`);
    if (!response.ok) {
      throw new Error('Error fetching membership details');
    }
    return response.json();
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Could not fetch membership details');
  }
};

export const applyDiscount = (price: number, discountPercentage: number): number => {
  return price * (1 - discountPercentage / 100);
};

export const checkInventory = async (bookId: string): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}/inventory`);
    if (!response.ok) {
      throw new Error('Error checking inventory');
    }
    const data = await response.json();
    return data.stock;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Could not check inventory');
  }
};