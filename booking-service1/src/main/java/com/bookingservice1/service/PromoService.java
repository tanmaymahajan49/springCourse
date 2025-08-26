package com.bookingservice1.service;

import com.bookingservice1.client.AdminClient;
import com.bookingservice1.dto.PromoValidationRequest;
import com.bookingservice1.dto.PromoValidationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PromoService {

    @Autowired
    private AdminClient adminClient;

    public PromoValidationResponse validatePromoCode(PromoValidationRequest request) {
        try {
            // Call admin service to validate promo code
            return adminClient.validatePromoCode(request);
        } catch (Exception e) {
            System.err.println("Error validating promo code: " + e.getMessage());
            return new PromoValidationResponse(false, "Promo code validation failed", 0.0);
        }
    }

    public Double applyPromoDiscount(String promoCode, Double originalAmount) {
        PromoValidationRequest request = new PromoValidationRequest(promoCode, originalAmount);
        PromoValidationResponse response = validatePromoCode(request);
        
        if (response.isValid()) {
            return originalAmount - response.getDiscountAmount();
        }
        
        return originalAmount;
    }
}
