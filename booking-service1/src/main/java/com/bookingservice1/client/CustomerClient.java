package com.bookingservice1.client;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.bookingservice1.dto.CustomerDTO;

@FeignClient(name = "customer-service")  // Name of the customer service registered in Eureka
public interface CustomerClient {

    @GetMapping("/api/customers/{customerId}")
    CustomerDTO getCustomerById(@PathVariable("customerId") Long customerId);
}

