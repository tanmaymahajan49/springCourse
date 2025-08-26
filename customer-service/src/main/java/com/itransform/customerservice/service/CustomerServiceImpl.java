package com.itransform.customerservice.service;

import com.itransform.customerservice.dto.CustomerDTO;
import com.itransform.customerservice.dto.PaymentDTO;
import com.itransform.customerservice.dto.WasherDTO;
import com.itransform.customerservice.entity.Customer;
import com.itransform.customerservice.exception.CustomerNotFoundException;
import com.itransform.customerservice.feign.WasherClient;
import com.itransform.customerservice.feign.paymentInterface;
import com.itransform.customerservice.repository.CustomerRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
public class CustomerServiceImpl implements CustomerService {

	
	
	@Autowired
	paymentInterface interface1;
	
    private final CustomerRepository customerRepository;
    private final WasherClient washerClient;
    private static final Logger logger = LoggerFactory.getLogger(CustomerServiceImpl.class);

    public CustomerServiceImpl(CustomerRepository customerRepository, WasherClient washerClient) {
        this.customerRepository = customerRepository;
        this.washerClient = washerClient;
    }

    @Override
    public String registerCustomer(CustomerDTO customerDTO) {
        if (customerRepository.existsByEmail(customerDTO.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        Customer customer = new Customer();
        customer.setFullName(customerDTO.getFullName());
        customer.setEmail(customerDTO.getEmail());
        customer.setPassword(customerDTO.getPassword());
        customer.setPhone(customerDTO.getPhone());
        customer.setAddress(customerDTO.getAddress());

        customerRepository.save(customer);
        System.out.println("HELLO 5");
		
        return "Customer registered successfully!";
    }

    @Override
    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found with id " + id));
    }

    @Override
    public String updateCustomer(Long id, CustomerDTO customerDTO) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found with id " + id));

        customer.setFullName(customerDTO.getFullName());
        customer.setEmail(customerDTO.getEmail());

        if (customerDTO.getPassword() != null && !customerDTO.getPassword().isEmpty()) {
            customer.setPassword(customerDTO.getPassword());
        }

        customer.setPhone(customerDTO.getPhone());
        customer.setAddress(customerDTO.getAddress());

        customerRepository.save(customer);
        return "Customer updated successfully!";
    }

    @Override
    public String deleteCustomer(Long id) {
        if (!customerRepository.existsById(id)) {
            throw new CustomerNotFoundException("Customer not found with id " + id);
        }

        customerRepository.deleteById(id);
        return "Customer deleted successfully!";
    }

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    @Override
    public List<CustomerDTO> searchByName(String name) {
        return customerRepository.findByFullName(name);
    }

    @Override
    public List<Customer> getCustomersWithPagination(int page, int size, String sortBy) {
        return null;
    }

    @Override
    public List<Customer> getCustomersByDateRange(String startDate, String endDate) {
        return null;
    }

    @Override
    public void sendWelcomeEmail(Long id) {
        // Optional: To be implemented
    }

    @Override
    public String rateWasher(Long washerId, int rating, String feedback) {
        WasherDTO washer = washerClient.getWasherById(washerId);

        if (washer == null) {
            throw new RuntimeException("Washer not found with ID: " + washerId);
        }

        int totalRatings = washer.getTotalRatings(); // make sure this field exists in WasherDTO
        double currentRating = washer.getAverageRating(); // same here

        double newAverage = ((currentRating * totalRatings) + rating) / (totalRatings + 1);
        washer.setAverageRating(newAverage);
        washer.setTotalRatings(totalRatings + 1);

        if (washer.getFeedbacks() != null) {
            washer.getFeedbacks().add(feedback); // ensure List<String> feedbacks exists in WasherDTO
        }

        washerClient.updateWasher(washerId, washer);
		return feedback;
    }

    public ResponseEntity<String> pay(PaymentDTO payment) {
        // Send payment info to Payment microservice via FeignClient
        ResponseEntity<PaymentDTO> response = interface1.pay(payment);

        if (response.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(200).body("Payment Successful!.");
        }

        return ResponseEntity.status(500).body("No valid booking found for payment details.");
    }

    
    @Override
    public Object fetchWasherDetails(Long washerId) {
        try {
            return washerClient.getWasherById(washerId);
        } catch (Exception ex) {
            logger.error("Failed to fetch washer details for ID {}: {}", washerId, ex.getMessage());
            return "Washer not found or Washer Service is currently unavailable.";
        }
    }
}
