package com.adminservice.controller;

import com.adminservice.entity.Admin;
import com.adminservice.entity.ServicePackage;
import com.adminservice.entity.Promo;
import com.adminservice.dto.PromoValidationRequest;
import com.adminservice.dto.PromoValidationResponse;
import com.adminservice.model.Booking;
import com.adminservice.service.AdminService;
import com.adminservice.feign.BookingClient;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admins")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private BookingClient bookingClient;

    @GetMapping
    public List<Admin> getAllAdmins() {
        return adminService.getAllAdmins();
    }

    @PostMapping
    public Admin addAdmin(@RequestBody Admin admin) {
        return adminService.addAdmin(admin);
    }

    // 👇 New Endpoint: Get all bookings from Booking Service
    @GetMapping("/bookings")
    public List<Booking> getAllBookingsFromBookingService() {
        return bookingClient.getAllBookings();
    }

    // User Management Endpoints
    @GetMapping("/customers")
    public ResponseEntity<?> getAllCustomers() {
        try {
            return ResponseEntity.ok(adminService.getAllCustomers());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching customers: " + e.getMessage());
        }
    }

    @GetMapping("/washers")
    public ResponseEntity<?> getAllWashers() {
        try {
            return ResponseEntity.ok(adminService.getAllWashers());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching washers: " + e.getMessage());
        }
    }

    @PutMapping("/customers/{id}/status")
    public ResponseEntity<String> updateCustomerStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            adminService.updateCustomerStatus(id, status);
            return ResponseEntity.ok("Customer status updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating customer status: " + e.getMessage());
        }
    }

    @PutMapping("/washers/{id}/status")
    public ResponseEntity<String> updateWasherStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            adminService.updateWasherStatus(id, status);
            return ResponseEntity.ok("Washer status updated successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating washer status: " + e.getMessage());
        }
    }

    // Package Management Endpoints
    @GetMapping("/packages")
    public ResponseEntity<?> getAllPackages() {
        return ResponseEntity.ok(adminService.getAllPackages());
    }

    @PostMapping("/packages")
    public ResponseEntity<?> createPackage(@RequestBody ServicePackage servicePackage) {
        try {
            ServicePackage created = adminService.createPackage(servicePackage);
            return ResponseEntity.status(201).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating package: " + e.getMessage());
        }
    }

    @PutMapping("/packages/{id}")
    public ResponseEntity<?> updatePackage(@PathVariable Long id, @RequestBody ServicePackage servicePackage) {
        try {
            ServicePackage updated = adminService.updatePackage(id, servicePackage);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating package: " + e.getMessage());
        }
    }

    @DeleteMapping("/packages/{id}")
    public ResponseEntity<String> deletePackage(@PathVariable Long id) {
        try {
            adminService.deletePackage(id);
            return ResponseEntity.ok("Package deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting package: " + e.getMessage());
        }
    }

    // Promo Management Endpoints
    @GetMapping("/promos")
    public ResponseEntity<?> getAllPromos() {
        return ResponseEntity.ok(adminService.getAllPromos());
    }

    @PostMapping("/promos")
    public ResponseEntity<?> createPromo(@RequestBody Promo promo) {
        try {
            Promo created = adminService.createPromo(promo);
            return ResponseEntity.status(201).body(created);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error creating promo: " + e.getMessage());
        }
    }

    @PutMapping("/promos/{id}")
    public ResponseEntity<?> updatePromo(@PathVariable Long id, @RequestBody Promo promo) {
        try {
            Promo updated = adminService.updatePromo(id, promo);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating promo: " + e.getMessage());
        }
    }

    @DeleteMapping("/promos/{id}")
    public ResponseEntity<String> deletePromo(@PathVariable Long id) {
        try {
            adminService.deletePromo(id);
            return ResponseEntity.ok("Promo deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting promo: " + e.getMessage());
        }
    }

    @PostMapping("/promos/validate")
    public ResponseEntity<?> validatePromoCode(@RequestBody PromoValidationRequest request) {
        try {
            PromoValidationResponse response = adminService.validatePromoCode(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error validating promo code: " + e.getMessage());
        }
    }

    // Reports Endpoints
    @GetMapping("/reports/bookings")
    public ResponseEntity<?> getBookingReports() {
        try {
            return ResponseEntity.ok(adminService.getBookingReports());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error generating booking reports: " + e.getMessage());
        }
    }

    @GetMapping("/reports/revenue")
    public ResponseEntity<?> getRevenueReports() {
        try {
            return ResponseEntity.ok(adminService.getRevenueReports());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error generating revenue reports: " + e.getMessage());
        }
    }
}
