package com.adminservice.dto;

public class PromoValidationRequest {
    private String promoCode;
    private Double orderAmount;

    public PromoValidationRequest() {}

    public PromoValidationRequest(String promoCode, Double orderAmount) {
        this.promoCode = promoCode;
        this.orderAmount = orderAmount;
    }

    public String getPromoCode() {
        return promoCode;
    }

    public void setPromoCode(String promoCode) {
        this.promoCode = promoCode;
    }

    public Double getOrderAmount() {
        return orderAmount;
    }

    public void setOrderAmount(Double orderAmount) {
        this.orderAmount = orderAmount;
    }
}
