package com.itransform.customerservice.service;

import com.itransform.customerservice.dto.CustomerDTO;
import com.itransform.customerservice.dto.PaymentDTO;
import com.itransform.customerservice.entity.Customer;
import java.util.List;

import org.springframework.http.ResponseEntity;

public interface CustomerService {
    String registerCustomer(CustomerDTO customerDTO);
    Customer getCustomerById(Long id);
    List<Customer> getAllCustomers();  // New method
    String updateCustomer(Long id, CustomerDTO dto);
    String deleteCustomer(Long id);
	List<CustomerDTO> searchByName(String name);
	List<Customer> getCustomersWithPagination(int page, int size, String sortBy);
	List<Customer> getCustomersByDateRange(String startDate, String endDate);
	void sendWelcomeEmail(Long id);
	String rateWasher(Long washerId, int rating, String feedback);
	Object fetchWasherDetails(Long id);
	ResponseEntity<String> pay(PaymentDTO payment);
}