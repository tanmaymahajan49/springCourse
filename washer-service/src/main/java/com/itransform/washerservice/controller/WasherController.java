package com.itransform.washerservice.controller;

import com.itransform.washerservice.dto.WasherDTO;
import com.itransform.washerservice.entity.Washer;
import com.itransform.washerservice.service.WasherService;
import com.itransform.washerservice.client.BookingClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/washers") // ✅ Updated here to match Feign path
@CrossOrigin(origins = "*") // Allow all origins for testing
public class WasherController {

    private final WasherService washerService;

    @Autowired(required = false)
    private BookingClient bookingClient;

    @Autowired
    public WasherController(WasherService washerService) {
        this.washerService = washerService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerWasher(@RequestBody WasherDTO dto) {
        return ResponseEntity.ok(washerService.registerWasher(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Washer> getWasherById(@PathVariable Long id) {
        return ResponseEntity.ok(washerService.getWasherById(id));
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Washer>> getAllWashers() {
        return ResponseEntity.ok(washerService.getAllWashers());
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateWasher(@PathVariable Long id, @RequestBody WasherDTO dto) {
        return ResponseEntity.ok(washerService.updateWasher(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteWasher(@PathVariable Long id) {
        return ResponseEntity.ok(washerService.deleteWasher(id));
    }

    // ===== BOOKING RELATED ENDPOINTS FOR WASHERS =====

    /**
     * Get all available bookings (PENDING status) for washers to accept
     */
    @GetMapping("/available-bookings")
    public ResponseEntity<List<Object>> getAvailableBookings() {
        if (bookingClient == null) {
            System.err.println("BookingClient not available");
            return ResponseEntity.ok(List.of());
        }

        try {
            List<Object> availableBookings = bookingClient.getBookingsByStatus("PENDING");
            return ResponseEntity.ok(availableBookings);
        } catch (Exception e) {
            System.err.println("Error fetching available bookings: " + e.getMessage());
            return ResponseEntity.ok(List.of()); // Return empty list if service is down
        }
    }

    /**
     * Get bookings assigned to a specific washer
     */
    @GetMapping("/{washerId}/bookings")
    public ResponseEntity<List<Object>> getWasherBookings(@PathVariable Long washerId) {
        if (bookingClient == null) {
            System.err.println("BookingClient not available");
            return ResponseEntity.ok(List.of());
        }

        try {
            List<Object> washerBookings = bookingClient.getBookingsByWasher(washerId);
            return ResponseEntity.ok(washerBookings);
        } catch (Exception e) {
            System.err.println("Error fetching washer bookings: " + e.getMessage());
            return ResponseEntity.ok(List.of()); // Return empty list if service is down
        }
    }

    /**
     * Accept a booking (update status from PENDING to ACCEPTED)
     */
    @PutMapping("/accept-booking/{bookingId}")
    public ResponseEntity<String> acceptBooking(@PathVariable Long bookingId, @RequestParam Long washerId) {
        if (bookingClient == null) {
            return ResponseEntity.badRequest().body("Booking service not available");
        }

        try {
            bookingClient.updateBookingStatus(bookingId, "ACCEPTED");
            return ResponseEntity.ok("Booking accepted successfully!");
        } catch (Exception e) {
            System.err.println("Error accepting booking: " + e.getMessage());
            return ResponseEntity.badRequest().body("Failed to accept booking: " + e.getMessage());
        }
    }

    /**
     * Complete a booking (update status to COMPLETED)
     */
    @PutMapping("/complete-booking/{bookingId}")
    public ResponseEntity<String> completeBooking(@PathVariable Long bookingId) {
        if (bookingClient == null) {
            return ResponseEntity.badRequest().body("Booking service not available");
        }

        try {
            bookingClient.updateBookingStatus(bookingId, "COMPLETED");
            return ResponseEntity.ok("Booking completed successfully!");
        } catch (Exception e) {
            System.err.println("Error completing booking: " + e.getMessage());
            return ResponseEntity.badRequest().body("Failed to complete booking: " + e.getMessage());
        }
    }
}
