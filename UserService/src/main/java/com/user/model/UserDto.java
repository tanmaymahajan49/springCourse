package com.user.model;

public class UserDto {

	/*
	 * private String first_name ; private String last_name ;
	 */
	/*
	 * private String email ; private String address; private String district ;
	 * private String pincode; private String phone_no ; private String password;
	 */
	private Long id;

	private String fullName;
	private String role;

	private String email;

	private String password;

	private String phone;

	private String address;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public UserDto(Long id, String fullName, String role, String email, String password, String phone, String address) {
		super();
		this.id = id;
		this.fullName = fullName;
		this.role = role;
		this.email = email;
		this.password = password;
		this.phone = phone;
		this.address = address;
	}

	public UserDto() {
		super();
	}

	
}
