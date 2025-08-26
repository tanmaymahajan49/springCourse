package com.paymentservice.model;

public class Booking {

    private Long id;
    private String customerName;
    private String serviceType;
    private String bookingDate;
    private String status;

    // Default constructor
    public Booking() {
    }

    // Parameterized constructor
    public Booking(Long id, String customerName, String serviceType, String bookingDate, String status) {
        this.id = id;
        this.customerName = customerName;
        this.serviceType = serviceType;
        this.bookingDate = bookingDate;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getServiceType() {
        return serviceType;
    }

    public void setServiceType(String serviceType) {
        this.serviceType = serviceType;
    }

    public String getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(String bookingDate) {
        this.bookingDate = bookingDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
