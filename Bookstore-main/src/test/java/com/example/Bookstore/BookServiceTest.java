package com.example.Bookstore;

import com.example.Bookstore.Models.Book;
import com.example.Bookstore.Repositories.BookRepository;
import com.example.Bookstore.Services.BookService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private BookService bookService;

    private Book testBook;

    @BeforeEach
    void setUp() {
        testBook = new Book();
        testBook.setBookId(1);
        testBook.setTitle("Test Book");
        testBook.setIsbn("1234567890");
        testBook.setPrice(100.0);
        testBook.setStock(10);
    }

    @Test
    void findByIdShouldReturnBook() {
        when(bookRepository.findById(1)).thenReturn(Optional.of(testBook));

        Book found = bookService.findById(1);

        assertNotNull(found);
        assertEquals("Test Book", found.getTitle());
        verify(bookRepository).findById(1);
    }

    @Test
    void findAllShouldReturnListOfBooks() {
        when(bookRepository.findAll()).thenReturn(Arrays.asList(testBook));

        List<Book> books = bookService.findAll();

        assertNotNull(books);
        assertFalse(books.isEmpty());
        assertEquals(1, books.size());
        verify(bookRepository).findAll();
    }

    @Test
    void saveShouldReturnSavedBook() {
        when(bookRepository.save(any(Book.class))).thenReturn(testBook);

        Book saved = bookService.save(testBook);

        assertNotNull(saved);
        assertEquals("Test Book", saved.getTitle());
        verify(bookRepository).save(testBook);
    }

    @Test
    void findByIsbnShouldReturnBook() {
        when(bookRepository.findByIsbn("1234567890")).thenReturn(testBook);

        Book found = bookService.findByIsbn("1234567890");

        assertNotNull(found);
        assertEquals("Test Book", found.getTitle());
        verify(bookRepository).findByIsbn("1234567890");
    }
}