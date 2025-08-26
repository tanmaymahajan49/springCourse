package com.adminservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "CUSTOMER-SERVICE")
public interface CustomerClient {

    @GetMapping("/api/customers")
    List<Object> getAllCustomers();

    @GetMapping("/api/customers/{id}")
    Object getCustomerById(@PathVariable("id") Long id);

    @PutMapping("/api/customers/{id}/status")
    Object updateCustomerStatus(@PathVariable("id") Long id, @RequestParam("status") String status);
}
