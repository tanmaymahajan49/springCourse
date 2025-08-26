package com.bookingservice1.dto;

public class WasherDTO {
    private Long id;
    private String name;
    private double rating;
    private String city;

    // Constructors
    public WasherDTO() {}

    public WasherDTO(Long id, String name, double rating, String city) {
        this.id = id;
        this.name = name;
        this.rating = rating;
        this.city = city;
    }

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

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }
}
