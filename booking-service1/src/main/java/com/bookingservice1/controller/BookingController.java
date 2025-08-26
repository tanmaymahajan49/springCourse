package com.bookingservice1.controller;

import com.bookingservice1.entity.Booking;
import com.bookingservice1.entity.Package;
import com.bookingservice1.entity.AddOn;
import com.bookingservice1.dto.PromoValidationResponse;
import com.bookingservice1.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*") // Allow all origins for testing
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        Optional<Booking> booking = bookingService.getBookingById(id);
        return booking.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking) {
        Booking newBooking = bookingService.createBooking(booking);
        return new ResponseEntity<>(newBooking, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Booking> updateBooking(@PathVariable Long id, @RequestBody Booking updatedBooking) {
        Booking updated = bookingService.updateBooking(id, updatedBooking);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Booking> updateBookingStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Booking updatedBooking = bookingService.updateBookingStatus(id, status);
            return ResponseEntity.ok(updatedBooking);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Booking>> getBookingsByCustomer(@PathVariable Long customerId) {
        List<Booking> bookings = bookingService.getBookingsByCustomerId(customerId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/washer/{washerId}")
    public ResponseEntity<List<Booking>> getBookingsByWasher(@PathVariable Long washerId) {
        List<Booking> bookings = bookingService.getBookingsByWasherId(washerId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Booking>> getBookingsByStatus(@PathVariable String status) {
        List<Booking> bookings = bookingService.getBookingsByStatus(status);
        return ResponseEntity.ok(bookings);
    }

    // Package and AddOn endpoints
    @GetMapping("/packages")
    public ResponseEntity<List<Package>> getAllActivePackages() {
        List<Package> packages = bookingService.getAllActivePackages();
        return ResponseEntity.ok(packages);
    }

    @GetMapping("/packages/{id}")
    public ResponseEntity<Package> getPackageById(@PathVariable Long id) {
        Package packageEntity = bookingService.getPackageById(id);
        return packageEntity != null ? ResponseEntity.ok(packageEntity) : ResponseEntity.notFound().build();
    }

    @GetMapping("/addons")
    public ResponseEntity<List<AddOn>> getAllActiveAddOns() {
        List<AddOn> addOns = bookingService.getAllActiveAddOns();
        return ResponseEntity.ok(addOns);
    }

    @GetMapping("/addons/{id}")
    public ResponseEntity<AddOn> getAddOnById(@PathVariable Long id) {
        AddOn addOn = bookingService.getAddOnById(id);
        return addOn != null ? ResponseEntity.ok(addOn) : ResponseEntity.notFound().build();
    }

    // Promo code endpoints
    @PostMapping("/{id}/apply-promo")
    public ResponseEntity<?> applyPromoCode(@PathVariable Long id, @RequestParam String promoCode) {
        try {
            Booking updatedBooking = bookingService.applyPromoCode(id, promoCode);
            return ResponseEntity.ok(updatedBooking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error applying promo code: " + e.getMessage());
        }
    }

    @PostMapping("/validate-promo")
    public ResponseEntity<PromoValidationResponse> validatePromoCode(@RequestParam String promoCode, @RequestParam Double amount) {
        PromoValidationResponse response = bookingService.validatePromo(promoCode, amount);
        return ResponseEntity.ok(response);
    }
}
