package com.example.Bookstore.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.Bookstore.Models.SaleTracking;
import com.example.Bookstore.Services.SaleTrackingService;

@RestController
@RequestMapping("/api/sales")
public class SaleTrackingController {
    
    private final SaleTrackingService saleTrackingService;
    
    @Autowired
    public SaleTrackingController(SaleTrackingService saleTrackingService) {
        this.saleTrackingService = saleTrackingService;
    }
    
    @PostMapping
    public ResponseEntity<SaleTracking> createSale(@RequestParam String userId, @RequestParam Double amount) {
        SaleTracking sale = saleTrackingService.createSale(userId, amount);
        return ResponseEntity.ok(sale);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SaleTracking> getSale(@PathVariable Long id) {
        return saleTrackingService.getSale(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping
    public ResponseEntity<List<SaleTracking>> getAllSales() {
        List<SaleTracking> sales = saleTrackingService.getAllSales();
        return ResponseEntity.ok(sales);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<SaleTracking> updateSaleStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            SaleTracking updatedSale = saleTrackingService.updateSaleStatus(id, status);
            return ResponseEntity.ok(updatedSale);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSale(@PathVariable Long id) {
        saleTrackingService.deleteSale(id);
        return ResponseEntity.noContent().build();
    }
}