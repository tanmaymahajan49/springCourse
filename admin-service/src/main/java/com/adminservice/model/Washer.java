package com.adminservice.model;

public class Washer {
    private Long id;
    private String name;
    private String city;
    private Double rating;
    private String contactInfo; // Ensure this field exists

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getContactInfo() { // Ensure you have this getter
        return contactInfo;
    }

    public void setContactInfo(String contactInfo) { // Ensure you have this setter
        this.contactInfo = contactInfo;
    }
}
