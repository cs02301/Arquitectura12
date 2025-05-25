package com.example.Bookstore.Services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors; // ¡IMPORTANTE! Importa tu nuevo DTO

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Para manejo de carga LAZY si es necesario

import com.example.Bookstore.DTO.BookResponseDTO;
import com.example.Bookstore.Models.Book;
import com.example.Bookstore.Repositories.BookRepository; // Para usar streams y map

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    // NUEVO: Método para devolver lista de DTOs
    @Transactional(readOnly = true) // Ayuda a asegurar que las relaciones LAZY (como Category si fuera LAZY) se carguen
    public List<BookResponseDTO> findAllBooksAsDTO() {
        List<Book> books = bookRepository.findAll();
        return books.stream()
                .map(book -> new BookResponseDTO(book)) // Mapea cada Book a BookResponseDTO
                .collect(Collectors.toList());
    }

    // NUEVO: Método para devolver un DTO opcional por ID
    @Transactional(readOnly = true)
    public Optional<BookResponseDTO> findBookDTOById(Integer id) {
        return bookRepository.findById(id)
                .map(book -> new BookResponseDTO(book)); // Mapea si se encuentra
    }

    // --- Métodos existentes (mantenlos si los usas en otra parte o para lógica interna) ---
    public Book save(Book book) {
        return bookRepository.save(book);
    }

    // Este método ya no será llamado directamente por el controlador para GET /api/books
    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    // Este método ya no será llamado directamente por el controlador para GET /api/books/{id}
    public Book findById(Integer id) {
        Optional<Book> optional = bookRepository.findById(id);
        return optional.orElse(null);
    }

    public Optional<Book> findOptionalById(Integer id) { // Útil para lógica interna si necesitas la entidad
        return bookRepository.findById(id);
    }

    public Book findByIsbn(String isbn) {
        // Considera si este también debería devolver un DTO
        return bookRepository.findByIsbn(isbn);
    }

    public List<Book> findByTitleContainingIgnoreCase(String title) {
        // Considera si este también debería devolver una lista de DTOs
        return bookRepository.findByTitleContainingIgnoreCase(title);
    }

    public void deleteById(Integer id) {
        bookRepository.deleteById(id);
    }
}