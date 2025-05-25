const API_BASE_URL = '/api';

export interface MembershipCard {
    cardId: number;
    cardNumber: string;
    balance: number;
    status: number;
    userId: number;
}

export const getMembershipCard = async (userId: number): Promise<MembershipCard> => {
    try {
        const response = await fetch(`${API_BASE_URL}/membership-cards/${userId}`);
        if (!response.ok) {
            throw new Error('Error al obtener datos de la tarjeta');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw new Error('No se pudo obtener la información de la tarjeta');
    }
};

export const checkBalance = async (cardId: number): Promise<number> => {
    try {
        const response = await fetch(`${API_BASE_URL}/membership-cards/${cardId}`);
        if (!response.ok) {
            throw new Error('Error al verificar saldo');
        }
        const card = await response.json();
        return card.balance;
    } catch (error) {
        console.error('Error:', error);
        throw new Error('No se pudo verificar el saldo');
    }
};

export const rechargeCard = async (cardId: number, amount: number): Promise<MembershipCard> => {
    try {
        const response = await fetch(`${API_BASE_URL}/membership-cards/${cardId}/recharge?amount=${amount}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al recargar la tarjeta');
        }
        
        return response.json();
    } catch (error) {
        console.error('Error:', error);
        throw new Error('No se pudo procesar la recarga');
    }
};

export const applyDiscount = (total: number): number => {
    const discountPercentage = 10; // 10% de descuento para miembros
    return total * (1 - discountPercentage / 100);
};

export const checkInventory = async (bookId: string): Promise<number> => {
    try {
        const response = await fetch(`${API_BASE_URL}/books/${bookId}`);
        if (!response.ok) {
            throw new Error('Error al verificar inventario');
        }
        const book = await response.json();
        return book.stock;
    } catch (error) {
        console.error('Error:', error);
        throw new Error('No se pudo verificar el inventario');
    }
};