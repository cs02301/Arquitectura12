package com.example.Bookstore.DTO;

import java.util.Date;

import com.example.Bookstore.Models.Book;

public class BookResponseDTO {
    private Integer bookId;
    private String title;
    private String isbn;
    private Double price;
    private String imageUrl;
    private Integer stock;
    private String categoryName;
    private String authorName;
    private String description;
    private Date publicationDate; // Se serializará como String ISO 8601 por defecto
    // private Byte status; // Descomenta si lo necesitas

    // Constructor por defecto (buena práctica para algunas librerías de serialización)
    public BookResponseDTO() {}

    // Constructor que toma una entidad Book
    public BookResponseDTO(Book book) {
        this.bookId = book.getBookId();
        this.title = book.getTitle();
        this.isbn = book.getIsbn();
        this.price = book.getPrice();
        this.imageUrl = book.getImageUrl();
        this.stock = book.getStock();

        if (book.getCategory() != null) {
            this.categoryName = book.getCategory().getCategoryName();
        } else {
            this.categoryName = "Sin Categoría";
        }

        // Si añadiste los campos a la entidad Book.java:
        this.authorName = book.getAuthorName() != null ? book.getAuthorName() : "Autor Desconocido";
        this.description = book.getDescription() != null ? book.getDescription() : "No disponible.";

        // Si NO añadiste los campos a Book.java y quieres placeholders por ahora:
        // this.authorName = "Autor Placeholder";
        // this.description = "Descripción Placeholder";

        this.publicationDate = book.getPublicationDate();
        // this.status = book.getStatus();
    }

    // --- GETTERS ---
    public Integer getBookId() { return bookId; }
    public String getTitle() { return title; }
    public String getIsbn() { return isbn; }
    public Double getPrice() { return price; }
    public String getImageUrl() { return imageUrl; }
    public Integer getStock() { return stock; }
    public String getCategoryName() { return categoryName; }
    public String getAuthorName() { return authorName; }
    public String getDescription() { return description; }
    public Date getPublicationDate() { return publicationDate; }
    // public Byte getStatus() { return status; }

    // --- SETTERS (opcionales para un DTO de respuesta, pero pueden ser útiles) ---
    public void setBookId(Integer bookId) { this.bookId = bookId; }
    public void setTitle(String title) { this.title = title; }
    public void setIsbn(String isbn) { this.isbn = isbn; }
    public void setPrice(Double price) { this.price = price; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public void setStock(Integer stock) { this.stock = stock; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
    public void setDescription(String description) { this.description = description; }
    public void setPublicationDate(Date publicationDate) { this.publicationDate = publicationDate; }
    // public void setStatus(Byte status) { this.status = status; }
}