package com.itransform.washerservice.dto;

public class WasherDTO {

	private String name;
	private String contactNumber;
	private String email;
	private String city;

	public WasherDTO() {
	}

	public WasherDTO(String name, String contactNumber, String email, String city) {
		this.name = name;
		this.contactNumber = contactNumber;
		this.email = email;
		this.city = city;
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

}
