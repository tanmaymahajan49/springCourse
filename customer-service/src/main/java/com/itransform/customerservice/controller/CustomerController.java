package com.itransform.customerservice.controller;

import com.itransform.customerservice.dto.CustomerDTO;
import com.itransform.customerservice.dto.PaymentDTO;
import com.itransform.customerservice.entity.Customer;
import com.itransform.customerservice.service.CustomerService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    // Constructor for dependency injection
    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    // Register customer - no need for a "/{register}" path, just use POST at "/api/customers"
    @PostMapping("/register")
    public ResponseEntity<String> registerCustomer(@Valid @RequestBody CustomerDTO customerDTO) {
        String result = customerService.registerCustomer(customerDTO);
        System.out.println("HELLO 4");
		
        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        Customer customer = customerService.getCustomerById(id);
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }
    
    @GetMapping("/allcustomer")
    public ResponseEntity<List<Customer>> getAllCustomers() {
        List<Customer> customers = customerService.getAllCustomers();
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateCustomer(@PathVariable Long id, 
                                                 @Valid @RequestBody CustomerDTO customerDTO) {
        String result = customerService.updateCustomer(id, customerDTO);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCustomer(@PathVariable Long id) {
        String result = customerService.deleteCustomer(id);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }
    
    @GetMapping("/search")
    public List<CustomerDTO> searchCustomers(@RequestParam String name) {
        return customerService.searchByName(name);
    }
    
    @GetMapping("/washer/{id}")
    public ResponseEntity<Object> getWasherFromWasherService(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.fetchWasherDetails(id));
    }

    @GetMapping
    public ResponseEntity<List<Customer>> getCustomersWithPagination(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id") String sortBy) {
        List<Customer> customers = customerService.getCustomersWithPagination(page, size, sortBy);
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }
    
    @GetMapping("/filterByDate")
    public ResponseEntity<List<Customer>> getCustomersByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        List<Customer> customers = customerService.getCustomersByDateRange(startDate, endDate);
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }
    
    @PostMapping("/notify/{id}")
    public ResponseEntity<String> sendWelcomeEmail(@PathVariable Long id) {
        customerService.sendWelcomeEmail(id);
        return new ResponseEntity<>("Email Sent Successfully!", HttpStatus.OK);
    }

    @PostMapping("/rateWasher")
    public ResponseEntity<String> rateWasher(
            @RequestParam Long washerId,
            @RequestParam int rating,
            @RequestParam String feedback) {
        customerService.rateWasher(washerId, rating, feedback);
        return new ResponseEntity<>("Washer Rated Successfully!", HttpStatus.OK);
    }

    @PostMapping("/pay")
	public ResponseEntity<String> pay(@RequestBody PaymentDTO payment) {
		return customerService.pay(payment);
	}
    
}
