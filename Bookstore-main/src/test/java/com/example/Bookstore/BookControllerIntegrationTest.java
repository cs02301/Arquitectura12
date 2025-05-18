package com.example.Bookstore;

import com.example.Bookstore.Models.Book;
import com.example.Bookstore.Repositories.BookRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class BookControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private BookRepository bookRepository;

    private Book testBook;

    @BeforeEach
    void setUp() {
        bookRepository.deleteAll();

        testBook = new Book();
        testBook.setTitle("Integration Test Book");
        testBook.setIsbn("9876543210");
        testBook.setPrice(150.0);
        testBook.setStock(5);
        testBook = bookRepository.save(testBook);
    }

    @Test
    void getAllBooksShouldReturnBooks() throws Exception {
        mockMvc.perform(get("/api/books"))
               .andExpect(status().isOk())
               .andExpect(content().contentType(MediaType.APPLICATION_JSON))
               .andExpect(jsonPath("$[0].title").value("Integration Test Book"));
    }

    @Test
    void getBookByIdShouldReturnBook() throws Exception {
        mockMvc.perform(get("/api/books/{id}", testBook.getBookId()))
               .andExpect(status().isOk())
               .andExpect(content().contentType(MediaType.APPLICATION_JSON))
               .andExpect(jsonPath("$.title").value("Integration Test Book"));
    }

    @Test
    void getBookByIdWithInvalidIdShouldReturn404() throws Exception {
        mockMvc.perform(get("/api/books/999999"))
               .andExpect(status().isNotFound());
    }

    @Test
    void getBookByIsbnShouldReturnBook() throws Exception {
        mockMvc.perform(get("/api/books/isbn/{isbn}", "9876543210"))
               .andExpect(status().isOk())
               .andExpect(content().contentType(MediaType.APPLICATION_JSON))
               .andExpect(jsonPath("$.isbn").value("9876543210"));
    }
}