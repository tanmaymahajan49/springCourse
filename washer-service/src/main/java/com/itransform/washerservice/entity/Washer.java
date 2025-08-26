package com.itransform.washerservice.entity;

import jakarta.persistence.*;

@Entity
public class Washer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String contactNumber;
    private String email;
    private String city;
    private String address;
    private Double latitude;
    private Double longitude;
    private String status = "ACTIVE"; // ACTIVE, INACTIVE, BUSY
    private Boolean isAvailable = true;

    private Double averageRating = 0.0;
    private int totalRatings = 0;

    // 🛠 Manual Getters and Setters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public String getEmail() {
        return email;
    }

    public String getCity() {
        return city;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public int getTotalRatings() {
        return totalRatings;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public void setTotalRatings(int totalRatings) {
        this.totalRatings = totalRatings;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

    // 🧱 Custom Builder
    public static class WasherBuilder {
        private final Washer washer;

        public WasherBuilder() {
            this.washer = new Washer();
        }

        public WasherBuilder name(String name) {
            washer.setName(name);
            return this;
        }

        public WasherBuilder contactNumber(String contactNumber) {
            washer.setContactNumber(contactNumber);
            return this;
        }

        public WasherBuilder email(String email) {
            washer.setEmail(email);
            return this;
        }

        public WasherBuilder city(String city) {
            washer.setCity(city);
            return this;
        }

        public WasherBuilder address(String address) {
            washer.setAddress(address);
            return this;
        }

        public WasherBuilder location(Double latitude, Double longitude) {
            washer.setLatitude(latitude);
            washer.setLongitude(longitude);
            return this;
        }

        public WasherBuilder status(String status) {
            washer.setStatus(status);
            return this;
        }

        public WasherBuilder available(Boolean isAvailable) {
            washer.setIsAvailable(isAvailable);
            return this;
        }

        public Washer build() {
            return washer;
        }
    }

    public static WasherBuilder builder() {
        return new WasherBuilder();
    }
}
