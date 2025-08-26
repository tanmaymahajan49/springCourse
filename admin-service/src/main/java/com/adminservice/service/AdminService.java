package com.adminservice.service;

import com.adminservice.client.WasherClient;
import com.adminservice.client.CustomerClient;
import com.adminservice.entity.Admin;
import com.adminservice.entity.ServicePackage;
import com.adminservice.entity.Promo;
import com.adminservice.dto.PromoValidationRequest;
import com.adminservice.dto.PromoValidationResponse;
import com.adminservice.model.Booking;
import com.adminservice.model.Washer;
import com.adminservice.repository.AdminRepository;
import com.adminservice.repository.ServicePackageRepository;
import com.adminservice.repository.PromoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import java.time.LocalDateTime;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private WasherClient washerClient;

    @Autowired
    private CustomerClient customerClient;

    @Autowired
    private ServicePackageRepository packageRepository;

    @Autowired
    private PromoRepository promoRepository;

    // Get all admins
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    // Add new admin
    public Admin addAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    // User Management Methods
    public List<Object> getAllCustomers() {
        return customerClient.getAllCustomers();
    }

    public List<Washer> getAllWashers() {
        return washerClient.getAllWashers();
    }

    public void updateCustomerStatus(Long id, String status) {
        customerClient.updateCustomerStatus(id, status);
    }

    public void updateWasherStatus(Long id, String status) {
        washerClient.updateWasherStatus(id, status);
    }

    // Package Management Methods
    public List<ServicePackage> getAllPackages() {
        return packageRepository.findAll();
    }

    public ServicePackage createPackage(ServicePackage servicePackage) {
        return packageRepository.save(servicePackage);
    }

    public ServicePackage updatePackage(Long id, ServicePackage servicePackage) {
        servicePackage.setId(id);
        return packageRepository.save(servicePackage);
    }

    public void deletePackage(Long id) {
        packageRepository.deleteById(id);
    }

    // Promo Management Methods
    public List<Promo> getAllPromos() {
        return promoRepository.findAll();
    }

    public Promo createPromo(Promo promo) {
        return promoRepository.save(promo);
    }

    public Promo updatePromo(Long id, Promo promo) {
        promo.setId(id);
        return promoRepository.save(promo);
    }

    public void deletePromo(Long id) {
        promoRepository.deleteById(id);
    }

    // Reports Methods
    public Map<String, Object> getBookingReports() {
        Map<String, Object> reports = new HashMap<>();
        // Add booking statistics
        reports.put("totalBookings", "100"); // Would fetch from booking service
        reports.put("completedBookings", "85");
        reports.put("pendingBookings", "15");
        reports.put("cancelledBookings", "5");
        return reports;
    }

    public Map<String, Object> getRevenueReports() {
        Map<String, Object> reports = new HashMap<>();
        // Add revenue statistics
        reports.put("totalRevenue", "50000");
        reports.put("monthlyRevenue", "15000");
        reports.put("averageBookingValue", "500");
        return reports;
    }

    // Get all bookings and associated washer details
    public List<Booking> getAllBookingsWithWasherDetails() {
        List<Booking> bookings = getAllBookings();

        // For each booking, fetch the washer details using Feign
        for (Booking booking : bookings) {
            try {
                Washer washer = washerClient.getWasherById(booking.getWasherId());
                booking.setWasherName(washer.getName());
                booking.setWasherContact(washer.getContactInfo());
            } catch (Exception e) {
                System.err.println("Error fetching washer details: " + e.getMessage());
            }
        }

        return bookings;
    }

    // Add method to get all bookings
    public List<Booking> getAllBookings() {
        // This would typically call booking service via Feign client
        // For now, return empty list
        return List.of();
    }

    // Promo validation method
    public PromoValidationResponse validatePromoCode(PromoValidationRequest request) {
        try {
            Optional<Promo> promoOpt = promoRepository.findByCodeAndIsActiveTrue(request.getPromoCode());

            if (promoOpt.isEmpty()) {
                return new PromoValidationResponse(false, "Promo code not found or inactive", 0.0);
            }

            Promo promo = promoOpt.get();

            // Check if promo is still valid
            if (!promo.isValid()) {
                return new PromoValidationResponse(false, "Promo code has expired or reached usage limit", 0.0);
            }

            // Check minimum order amount
            if (promo.getMinimumOrderAmount() != null &&
                request.getOrderAmount() < promo.getMinimumOrderAmount()) {
                return new PromoValidationResponse(false,
                    "Minimum order amount of ₹" + promo.getMinimumOrderAmount() + " required", 0.0);
            }

            // Calculate discount
            Double discountAmount = 0.0;
            if ("PERCENTAGE".equals(promo.getDiscountType())) {
                discountAmount = (request.getOrderAmount() * promo.getDiscountValue()) / 100;
            } else if ("FIXED_AMOUNT".equals(promo.getDiscountType())) {
                discountAmount = promo.getDiscountValue();
            }

            // Ensure discount doesn't exceed order amount
            discountAmount = Math.min(discountAmount, request.getOrderAmount());

            // Update usage count
            promo.setCurrentUsageCount(promo.getCurrentUsageCount() + 1);
            promoRepository.save(promo);

            return new PromoValidationResponse(true, "Promo code applied successfully", discountAmount);

        } catch (Exception e) {
            System.err.println("Error validating promo code: " + e.getMessage());
            return new PromoValidationResponse(false, "Error validating promo code", 0.0);
        }
    }
}
