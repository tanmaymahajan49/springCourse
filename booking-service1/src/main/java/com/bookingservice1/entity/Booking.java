package com.bookingservice1.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long customerId;
    private Long washerId;
    private Long carId;
    private Long packageId;

    @ElementCollection
    @CollectionTable(name = "booking_addons", joinColumns = @JoinColumn(name = "booking_id"))
    @Column(name = "addon_id")
    private List<Long> addonIds = new ArrayList<>();

    private LocalDateTime bookingDateTime;
    private LocalDateTime preferredDateTime;
    private String customerLocation;
    private String status; // PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED
    private String paymentStatus; // PENDING, PAID, FAILED
    private Double totalAmount;
    private String specialInstructions;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Constructors
    public Booking() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = "PENDING";
        this.paymentStatus = "PENDING";
    }

    public Booking(Long customerId, Long washerId, Long carId, Long packageId, LocalDateTime preferredDateTime, String customerLocation) {
        this();
        this.customerId = customerId;
        this.washerId = washerId;
        this.carId = carId;
        this.packageId = packageId;
        this.preferredDateTime = preferredDateTime;
        this.customerLocation = customerLocation;
    }

    // Getters and Setters
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

    public Long getCarId() {
        return carId;
    }

    public void setCarId(Long carId) {
        this.carId = carId;
    }

    public Long getPackageId() {
        return packageId;
    }

    public void setPackageId(Long packageId) {
        this.packageId = packageId;
    }

    public List<Long> getAddonIds() {
        return addonIds;
    }

    public void setAddonIds(List<Long> addonIds) {
        this.addonIds = addonIds;
    }

    public LocalDateTime getBookingDateTime() {
        return bookingDateTime;
    }

    public void setBookingDateTime(LocalDateTime bookingDateTime) {
        this.bookingDateTime = bookingDateTime;
        this.updatedAt = LocalDateTime.now();
    }

    public LocalDateTime getPreferredDateTime() {
        return preferredDateTime;
    }

    public void setPreferredDateTime(LocalDateTime preferredDateTime) {
        this.preferredDateTime = preferredDateTime;
    }

    public String getCustomerLocation() {
        return customerLocation;
    }

    public void setCustomerLocation(String customerLocation) {
        this.customerLocation = customerLocation;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
        this.updatedAt = LocalDateTime.now();
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getSpecialInstructions() {
        return specialInstructions;
    }

    public void setSpecialInstructions(String specialInstructions) {
        this.specialInstructions = specialInstructions;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "Booking{" +
                "id=" + id +
                ", customerId=" + customerId +
                ", washerId=" + washerId +
                ", carId=" + carId +
                ", packageId=" + packageId +
                ", status='" + status + '\'' +
                ", paymentStatus='" + paymentStatus + '\'' +
                ", totalAmount=" + totalAmount +
                ", preferredDateTime=" + preferredDateTime +
                ", customerLocation='" + customerLocation + '\'' +
                '}';
    }
}
