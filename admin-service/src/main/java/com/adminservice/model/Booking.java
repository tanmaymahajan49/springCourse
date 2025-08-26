package com.adminservice.model;

public class Booking {
    private Long id;
    
    private Long customerId;
    private Long washerId;
    private String carDetails;
    private String date;
    private String status;

    // Added fields for washer details
    private String washerName;
    private String washerContact;

    // Getters & Setters for all fields

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getWasherId() {
        return washerId;
    }

    public void setWasherId(Long washerId) {
        this.washerId = washerId;
    }

    public String getCarDetails() {
        return carDetails;
    }

    public void setCarDetails(String carDetails) {
        this.carDetails = carDetails;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // Getter and Setter for washerName
    public String getWasherName() {
        return washerName;
    }

    public void setWasherName(String washerName) {
        this.washerName = washerName;
    }

    // Getter and Setter for washerContact
    public String getWasherContact() {
        return washerContact;
    }

    public void setWasherContact(String washerContact) {
        this.washerContact = washerContact;
    }
}
