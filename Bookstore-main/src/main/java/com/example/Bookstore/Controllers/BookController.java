package com.example.Bookstore.Controllers;

// Tus importaciones existentes
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors; // ¡IMPORTANTE! Importa tu DTO

import org.springframework.http.HttpStatus; // Para el POST
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping; // Para el método getBooksByTitle
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Bookstore.DTO.BookResponseDTO;
import com.example.Bookstore.Models.Book;
import com.example.Bookstore.Services.BookService;

@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    // MODIFICADO: Devuelve List<BookResponseDTO>
    @GetMapping
    public List<BookResponseDTO> getAllBooks() {
        return bookService.findAllBooksAsDTO();
    }

    // MODIFICADO: Devuelve ResponseEntity<BookResponseDTO>
    @GetMapping("/{id}")
    public ResponseEntity<BookResponseDTO> getBookById(@PathVariable Integer id) {
        Optional<BookResponseDTO> bookDTO = bookService.findBookDTOById(id);
        return bookDTO.map(ResponseEntity::ok) // Si presente, devuelve 200 OK con el DTO
                      .orElseGet(() -> ResponseEntity.notFound().build()); // Si no, devuelve 404 Not Found
    }

    // --- Otros Endpoints (considera si también deberían devolver DTOs) ---

    @GetMapping("/isbn/{isbn}")
    public ResponseEntity<BookResponseDTO> getBookByIsbn(@PathVariable String isbn) {
        Book book = bookService.findByIsbn(isbn);
        if (book == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(new BookResponseDTO(book)); // Mapea a DTO
    }

    @GetMapping("/title")
    public List<BookResponseDTO> getBooksByTitle(@RequestParam("name") String title) {
        List<Book> books = bookService.findByTitleContainingIgnoreCase(title);
        return books.stream()
                    .map(BookResponseDTO::new) // Mapea a DTO
                    .collect(Collectors.toList());
    }

    // POST para crear un libro. Recibe la entidad Book, devuelve el BookResponseDTO del libro creado.
    @PostMapping
    public ResponseEntity<BookResponseDTO> createBook(@RequestBody Book book) {
        // Aquí deberías asegurarte que los campos authorName y description
        // que vienen en el objeto 'book' del request se persistan.
        // Si tu entidad Book ya tiene setters para authorName y description,
        // y el JSON del request los incluye, Spring los mapeará.
        Book savedBook = bookService.save(book);
        // Es buena práctica devolver el recurso creado, con su ID y estado completo.
        BookResponseDTO bookDTO = new BookResponseDTO(savedBook);
        return ResponseEntity.status(HttpStatus.CREATED).body(bookDTO);
    }


    // PUT para actualizar un libro. Recibe la entidad Book, devuelve el BookResponseDTO del libro actualizado.
    @PutMapping("/{id}")
    public ResponseEntity<BookResponseDTO> updateBook(@PathVariable Integer id, @RequestBody Book bookDetails) {
        // Es mejor usar Optional para manejar el caso de "no encontrado"
        Optional<Book> existingBookOptional = bookService.findOptionalById(id); // Asume que tienes este método en el servicio
        if (existingBookOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Book existingBook = existingBookOptional.get();
        existingBook.setTitle(bookDetails.getTitle());
        existingBook.setIsbn(bookDetails.getIsbn());
        existingBook.setPrice(bookDetails.getPrice());
        existingBook.setImageUrl(bookDetails.getImageUrl());
        existingBook.setStock(bookDetails.getStock());
        existingBook.setCategory(bookDetails.getCategory()); // Asume que el cliente envía un objeto Category válido o su ID y lo manejas
        existingBook.setPublicationDate(bookDetails.getPublicationDate());
        existingBook.setStatus(bookDetails.getStatus());
        existingBook.setAuthorName(bookDetails.getAuthorName()); // Actualiza autor
        existingBook.setDescription(bookDetails.getDescription()); // Actualiza descripción

        Book updatedBook = bookService.save(existingBook);
        return ResponseEntity.ok(new BookResponseDTO(updatedBook));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Integer id) {
        if (bookService.findOptionalById(id).isEmpty()) { // Usa Optional para verificar existencia
             return ResponseEntity.notFound().build();
        }
        bookService.deleteById(id);
        return ResponseEntity.noContent().build(); // 204 No Content es apropiado para DELETE exitoso
    }
}