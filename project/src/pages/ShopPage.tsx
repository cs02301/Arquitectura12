import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import BookGrid from '../components/BookGrid';
import SearchFilters from '../components/SearchFilters';
import { Book, BookCategory, PriceRange } from '../types/Book'; // Tu tipo Book del frontend
import { fetchAllBooksFromApi, ApiBook } from '../services/bookService'; // Solo UNA VEZ estas importaciones

// YA NO USAREMOS allBooks directamente aquí, lo cargaremos de la API
// import { allBooks } from '../data/books'; // Comentado o eliminado está bien

// Función para mapear los datos de la API al formato que esperan tus componentes
const mapApiBookToFrontendBook = (apiBook: ApiBook): Book => {
  return {
    id: String(apiBook.bookId),
    title: apiBook.title,
    author: apiBook.authorName, // <- Ahora viene de ApiBook (que mapea BookResponseDTO)
    description: apiBook.description, // <- Ahora viene de ApiBook
    coverImage: apiBook.imageUrl,
    price: `${apiBook.price.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}`, // Formatear precio
    numericPrice: apiBook.price,
    isbn: apiBook.isbn,
    // Mapear categoryName (String) a tu enum BookCategory
    // Esto es un ejemplo simple, podrías necesitar un mapeo más robusto
    category: Object.values(BookCategory).find(cat => cat.toLowerCase() === apiBook.categoryName?.toLowerCase()) || BookCategory.Fiction,
    publishDate: apiBook.publicationDate ? new Date(apiBook.publicationDate).toISOString().split('T')[0] : "Fecha Desconocida",
  };
};

const ShopPage: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('q') || '';

  // Estado para los libros cargados desde la API
  const [loadedBooks, setLoadedBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para los filtros (estos ya los tenías)
  const [selectedCategory, setSelectedCategory] = useState<BookCategory | 'all'>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange | null>(null);
  const [selectedAuthorState, setSelectedAuthorState] = useState(''); // Renombrado para evitar conflicto con la variable 'authors'
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Cargar libros desde la API cuando el componente se monta
  useEffect(() => {
    const loadBooks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const apiBooksResult = await fetchAllBooksFromApi();
        const mappedBooks = apiBooksResult.map(mapApiBookToFrontendBook);
        setLoadedBooks(mappedBooks);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Ocurrió un error desconocido al cargar los libros.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadBooks();
  }, []); // El array vacío significa que se ejecuta solo una vez al montar

  // Obtener autores únicos de los libros cargados
  const authors = useMemo(() => {
    // Asegúrate que 'author' exista en tu tipo 'Book' y esté poblado después del mapeo
    return Array.from(new Set(loadedBooks.map(book => book.author))).sort();
  }, [loadedBooks]);

  // Filtrar libros basados en todos los criterios (usa loadedBooks en lugar de allBooks)
  const filteredBooks = useMemo(() => {
    return loadedBooks.filter(book => {
      // Search by title, author, or ISBN
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = book.title.toLowerCase().includes(query);
        // Necesitas asegurarte que `book.author` y `book.isbn` no sean undefined después del mapeo.
        const matchesAuthor = book.author?.toLowerCase().includes(query) ?? false;
        const matchesISBN = book.isbn?.includes(query) ?? false;
        if (!matchesTitle && !matchesAuthor && !matchesISBN) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && book.category !== selectedCategory) {
        return false;
      }

      // Price range filter
      if (selectedPriceRange) {
        if (book.numericPrice < selectedPriceRange.min || book.numericPrice > selectedPriceRange.max) {
          return false;
        }
      }

      // Author filter
      if (selectedAuthorState && book.author !== selectedAuthorState) {
        return false;
      }

      // Date range filter
      if (dateRange.start || dateRange.end) {
        // Asegúrate que book.publishDate sea un string de fecha válido para new Date()
        try {
            const publishDate = new Date(book.publishDate);
            if (isNaN(publishDate.getTime())) { // Verifica si la fecha es inválida
                // Decide cómo manejar fechas inválidas, quizás no filtrar o loguear un error
                return true; // o false, dependiendo de cómo quieras manejarlo
            }
            if (dateRange.start && publishDate < new Date(dateRange.start)) {
              return false;
            }
            if (dateRange.end && publishDate > new Date(dateRange.end)) {
              return false;
            }
        } catch(e) {
            // Si hay error al parsear la fecha, no aplicar este filtro o loguear.
            console.warn("Error parsing publishDate for filtering:", book.publishDate, e);
            return true;
        }
      }

      return true;
    });
  }, [loadedBooks, searchQuery, selectedCategory, selectedPriceRange, selectedAuthorState, dateRange]);

  if (isLoading) {
    return <div className="page-transition text-center py-10">Cargando libros...</div>;
  }

  if (error) {
    return <div className="page-transition text-center py-10 text-red-500">Error al cargar libros: {error}</div>;
  }

  return (
    <div className="page-transition">
      <h1 className="text-3xl font-bold mb-8">Shop Books</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <SearchFilters
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedPriceRange={selectedPriceRange}
            setSelectedPriceRange={setSelectedPriceRange}
            selectedAuthor={selectedAuthorState} // Usa el estado renombrado
            setSelectedAuthor={setSelectedAuthorState} // Usa el estado renombrado
            dateRange={dateRange}
            setDateRange={setDateRange}
            authors={authors} // Usa la lista de autores derivada de los libros cargados
          />
        </div>
        
        <div className="lg:col-span-3">
          {filteredBooks.length === 0 && !isLoading ? (
            <p>No se encontraron libros con los filtros aplicados.</p>
          ) : (
            <BookGrid 
              title={`${filteredBooks.length} books found`}
              books={filteredBooks}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopPage;