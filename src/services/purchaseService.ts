const API_BASE_URL = '/api';

interface BookPurchaseClient {
    bookId: number;
    quantity: number;
}

export interface ApiPurchaseRequest {
    userId: number;
    cardId: number;
    books: BookPurchaseClient[];
}

export interface ApiPurchaseResponse {
    message?: string;
    purchaseId?: number;
    error?: string;
}

export const makePurchaseApi = async (purchaseData: ApiPurchaseRequest): Promise<ApiPurchaseResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/purchases/make`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(purchaseData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error procesando la compra');
        }

        return response.json();
    } catch (error) {
        console.error('Error:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Error inesperado durante la compra');
    }
};