package com.bookingservice1.dto;

public class PromoValidationResponse {
    private boolean valid;
    private String message;
    private Double discountAmount;

    public PromoValidationResponse() {}

    public PromoValidationResponse(boolean valid, String message, Double discountAmount) {
        this.valid = valid;
        this.message = message;
        this.discountAmount = discountAmount;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Double getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(Double discountAmount) {
        this.discountAmount = discountAmount;
    }
}
