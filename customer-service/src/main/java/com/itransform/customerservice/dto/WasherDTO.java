package com.itransform.customerservice.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
public class WasherDTO {

    private Long id;
    private String name;
    private String contactNumber;
    private String email;
    private String city;

    private Double averageRating = 0.0;
    private int totalRatings = 0;

    private List<String> feedbacks = new ArrayList<>();

    // 🧱 Optional Custom Builder (only if you plan to use builder pattern manually)
    public static class WasherBuilder {
        private final WasherDTO washer;

        public WasherBuilder() {
            this.washer = new WasherDTO();
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

        public WasherDTO build() {
            return washer;
        }
    }

    public static WasherBuilder builder() {
        return new WasherBuilder();
    }

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

	public String getContactNumber() {
		return contactNumber;
	}

	public void setContactNumber(String contactNumber) {
		this.contactNumber = contactNumber;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public Double getAverageRating() {
		return averageRating;
	}

	public void setAverageRating(Double averageRating) {
		this.averageRating = averageRating;
	}

	public int getTotalRatings() {
		return totalRatings;
	}

	public void setTotalRatings(int totalRatings) {
		this.totalRatings = totalRatings;
	}

	public List<String> getFeedbacks() {
		return feedbacks;
	}

	public void setFeedbacks(List<String> feedbacks) {
		this.feedbacks = feedbacks;
	}
}
