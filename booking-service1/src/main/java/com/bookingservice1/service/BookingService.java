package com.bookingservice1.service;

import com.bookingservice.model.NotificationMessage;
import com.bookingservice1.client.CustomerClient;
import com.bookingservice1.client.WasherClient;
import com.bookingservice1.dto.CustomerDTO;
import com.bookingservice1.dto.WasherDTO;
import com.bookingservice1.entity.Booking;
import com.bookingservice1.entity.Package;
import com.bookingservice1.entity.AddOn;
import com.bookingservice1.dto.PromoValidationRequest;
import com.bookingservice1.dto.PromoValidationResponse;
import com.bookingservice1.repository.BookingRepository;
import com.bookingservice1.repository.PackageRepository;
import com.bookingservice1.repository.AddOnRepository;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private CustomerClient customerClient;

    @Autowired
    private WasherClient washerClient;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private PackageRepository packageRepository;

    @Autowired
    private AddOnRepository addOnRepository;

    @Autowired
    private PromoService promoService;

    // Email sender via RabbitMQ
    public void sendBookingConfirmationEmail(String customerEmail, String subject, String body) {
        NotificationMessage message = new NotificationMessage();
        message.setTo(customerEmail);
        message.setSubject(subject);
        message.setBody(body);

        rabbitTemplate.convertAndSend("notification-queue", message);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    @CircuitBreaker(name = "booking-service", fallbackMethod = "fallbackForCreateBooking")
    public Booking createBooking(Booking booking) {
        // Fetch customer details
        CustomerDTO customer = customerClient.getCustomerById(booking.getCustomerId());

        // Auto-assign washer if not specified
        if (booking.getWasherId() == null) {
            WasherDTO assignedWasher = findBestAvailableWasher(booking.getCustomerLocation());
            if (assignedWasher != null) {
                booking.setWasherId(assignedWasher.getId());
            } else {
                throw new RuntimeException("No available washers found for your location");
            }
        }

        // Fetch assigned washer details
        WasherDTO washer = washerClient.getWasherById(booking.getWasherId());

        // Calculate total amount (this would be enhanced with package and addon pricing)
        booking.setTotalAmount(calculateTotalAmount(booking));

        System.out.println("Booking for Customer: " + customer.getName() + ", Washer: " + washer.getName());

        Booking savedBooking = bookingRepository.save(booking);

        String subject = "Car Wash Booking Confirmed ✅";
        String body = "Hi " + customer.getName() + ",\n\nYour car wash has been successfully booked with washer "
                + washer.getName() + " on " + booking.getPreferredDateTime() + ".\n\nThank you for choosing us!";

        sendBookingConfirmationEmail(customer.getEmail(), subject, body);

        return savedBooking;
    }

    // Fallback method for circuit breaker
    public Booking fallbackForCreateBooking(Booking booking, Throwable throwable) {
        System.out.println("⚠️ Circuit Breaker activated for createBooking()! Fallback called.");
        System.out.println("Reason: " + throwable.getMessage());

        // Return a default/partial booking or null based on your handling
        Booking fallbackBooking = new Booking();
        fallbackBooking.setPreferredDateTime(booking.getPreferredDateTime());
        fallbackBooking.setStatus("Pending - Service temporarily unavailable");

        return fallbackBooking;
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    public Booking updateBooking(Long id, Booking updatedBooking) {
        Optional<Booking> existingBooking = bookingRepository.findById(id);
        if (existingBooking.isPresent()) {
            updatedBooking.setId(id);
            return bookingRepository.save(updatedBooking);
        }
        return null;
    }

    public Booking updateBookingStatus(Long id, String status) {
        Optional<Booking> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            booking.setStatus(status);
            return bookingRepository.save(booking);
        }
        throw new RuntimeException("Booking not found with id " + id);
    }

    // Helper method to find best available washer based on location and rating
    private WasherDTO findBestAvailableWasher(String customerLocation) {
        try {
            // This would call a method in WasherClient to get available washers by location
            // For now, we'll get the first available washer with highest rating
            // In a real implementation, this would use geolocation algorithms

            // For demo purposes, we'll get washer with ID 1 (assuming it exists)
            // In production, this would be more sophisticated
            return washerClient.getWasherById(1L);
        } catch (Exception e) {
            System.err.println("Error finding available washer: " + e.getMessage());
            return null;
        }
    }

    // Helper method to calculate total booking amount
    private Double calculateTotalAmount(Booking booking) {
        Double total = 0.0;

        try {
            // Add package price from database
            if (booking.getPackageId() != null) {
                Package packageEntity = packageRepository.findById(booking.getPackageId()).orElse(null);
                if (packageEntity != null && packageEntity.getIsActive()) {
                    total += packageEntity.getPrice();
                    System.out.println("Added package price: " + packageEntity.getPrice());
                } else {
                    total += 500.0; // Default package price
                }
            }

            // Add addon prices from database
            if (booking.getAddonIds() != null && !booking.getAddonIds().isEmpty()) {
                for (Long addonId : booking.getAddonIds()) {
                    AddOn addon = addOnRepository.findById(addonId).orElse(null);
                    if (addon != null && addon.getIsActive()) {
                        total += addon.getPrice();
                        System.out.println("Added addon price: " + addon.getPrice());
                    } else {
                        total += 100.0; // Default addon price
                    }
                }
            }

            return total > 0 ? total : 300.0; // Minimum booking amount
        } catch (Exception e) {
            System.err.println("Error calculating total amount: " + e.getMessage());
            return 300.0; // Default amount
        }
    }

    // New methods for package and addon management
    public List<Package> getAllActivePackages() {
        return packageRepository.findByIsActiveTrue();
    }

    public List<AddOn> getAllActiveAddOns() {
        return addOnRepository.findByIsActiveTrue();
    }

    public Package getPackageById(Long id) {
        return packageRepository.findById(id).orElse(null);
    }

    public AddOn getAddOnById(Long id) {
        return addOnRepository.findById(id).orElse(null);
    }

    // Promo code methods
    public Booking applyPromoCode(Long bookingId, String promoCode) {
        Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            Double originalAmount = booking.getTotalAmount();

            if (originalAmount != null) {
                Double discountedAmount = promoService.applyPromoDiscount(promoCode, originalAmount);
                booking.setTotalAmount(discountedAmount);
                return bookingRepository.save(booking);
            }
        }
        throw new RuntimeException("Booking not found or invalid amount");
    }

    public PromoValidationResponse validatePromo(String promoCode, Double amount) {
        PromoValidationRequest request = new PromoValidationRequest(promoCode, amount);
        return promoService.validatePromoCode(request);
    }

    // Additional query methods
    public List<Booking> getBookingsByCustomerId(Long customerId) {
        return bookingRepository.findByCustomerId(customerId);
    }

    public List<Booking> getBookingsByWasherId(Long washerId) {
        return bookingRepository.findByWasherId(washerId);
    }

    public List<Booking> getBookingsByStatus(String status) {
        return bookingRepository.findByStatus(status);
    }
}
