// project/src/services/bookService.ts

// Este tipo DEBE COINCIDIR con los campos expuestos por tu BookResponseDTO.java
export interface ApiBook {
  bookId: number;
  title: string;
  isbn: string;
  price: number;
  imageUrl: string;
  stock: number;
  categoryName: string | null;
  authorName: string;
  description: string;
  publicationDate: string;
}

const API_BASE_URL = '/api';

export const fetchAllBooksFromApi = async (): Promise<ApiBook[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/books`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("La respuesta del servidor no es JSON válido");
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching books:', error);
    throw new Error('Error al cargar los libros. Por favor, intente nuevamente.');
  }
};

export const fetchBookByIdFromApi = async (id: string): Promise<ApiBook> => {
  try {
    const response = await fetch(`${API_BASE_URL}/books/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("La respuesta del servidor no es JSON válido");
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching book:', error);
    throw new Error('Error al cargar el libro. Por favor, intente nuevamente.');
  }
};