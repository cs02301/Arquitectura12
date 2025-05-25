package com.example.Bookstore.Services;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.Bookstore.DTO.PurchaseRequest;
import com.example.Bookstore.Models.Book;
import com.example.Bookstore.Models.MembershipCard;
import com.example.Bookstore.Models.Purchase;
import com.example.Bookstore.Models.PurchaseDetails;
import com.example.Bookstore.Models.User;
import com.example.Bookstore.Repositories.BookRepository;
import com.example.Bookstore.Repositories.MembershipCardRepository;
import com.example.Bookstore.Repositories.PurchaseDetailsRepository;
import com.example.Bookstore.Repositories.PurchaseRepository;
import com.example.Bookstore.Repositories.UserRepository;

@Service
public class PurchaseService {

    private final BookRepository bookRepository;
    private final MembershipCardRepository cardRepository;
    private final PurchaseRepository purchaseRepository;
    private final PurchaseDetailsRepository purchaseDetailsRepository;
    private final UserRepository userRepository;

    @Autowired
    public PurchaseService(
            BookRepository bookRepository,
            MembershipCardRepository cardRepository,
            PurchaseRepository purchaseRepository,
            PurchaseDetailsRepository purchaseDetailsRepository,
            UserRepository userRepository) {
        this.bookRepository = bookRepository;
        this.cardRepository = cardRepository;
        this.purchaseRepository = purchaseRepository;
        this.purchaseDetailsRepository = purchaseDetailsRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Purchase makePurchase(PurchaseRequest request) {
        // Validate card and user
        MembershipCard card = cardRepository.findById(request.getCardId())
            .orElseThrow(() -> new IllegalArgumentException("Tarjeta no encontrada"));

        User user = userRepository.findById(request.getUserId())
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        if (!card.getUser().getUserId().equals(user.getUserId())) {
            throw new IllegalArgumentException("La tarjeta no pertenece al usuario especificado");
        }

        double totalPrice = 0.0;
        List<Book> booksToUpdate = new ArrayList<>();
        List<PurchaseDetails> purchaseDetails = new ArrayList<>();

        // Validate stock and calculate total price
        for (PurchaseRequest.BookPurchase item : request.getBooks()) {
            Book book = bookRepository.findById(item.getBookId())
                .orElseThrow(() -> new IllegalArgumentException("Libro no encontrado: " + item.getBookId()));

            if (book.getStock() < item.getQuantity()) {
                throw new IllegalStateException("Stock insuficiente para: " + book.getTitle());
            }

            totalPrice += book.getPrice() * item.getQuantity();
            book.setStock(book.getStock() - item.getQuantity());
            booksToUpdate.add(book);
        }

        // Validate card balance
        if (card.getBalance() < totalPrice) {
            throw new IllegalStateException("Saldo insuficiente en la tarjeta");
        }

        // Create purchase
        Purchase purchase = new Purchase();
        purchase.setUser(user);
        purchase.setMembershipCard(card);
        purchase.setTotal(totalPrice);
        purchase.setStatus((byte) 1);
        purchase.setCreatedAt(new Date());
        Purchase savedPurchase = purchaseRepository.save(purchase);

        // Update stock and create details
        for (int i = 0; i < request.getBooks().size(); i++) {
            PurchaseRequest.BookPurchase item = request.getBooks().get(i);
            Book book = booksToUpdate.get(i);
            
            // Update book stock
            bookRepository.save(book);

            // Create purchase detail
            PurchaseDetails detail = new PurchaseDetails();
            detail.setPurchase(savedPurchase);
            detail.setBook(book);
            detail.setQuantity(item.getQuantity());
            detail.setUnitPrice(book.getPrice());
            detail.setSubtotal(book.getPrice() * item.getQuantity());
            detail.setCreatedAt(new Date());
            purchaseDetails.add(purchaseDetailsRepository.save(detail));
        }

        // Update card balance
        card.setBalance(card.getBalance() - totalPrice);
        cardRepository.save(card);

        return savedPurchase;
    }

    public Purchase save(Purchase purchase) {
        return purchaseRepository.save(purchase);
    }

    public List<Purchase> findAll() {
        return purchaseRepository.findAll();
    }

    public Purchase findById(Integer id) {
        return purchaseRepository.findById(id).orElse(null);
    }

    public void deleteById(Integer id) {
        purchaseRepository.deleteById(id);
    }
}