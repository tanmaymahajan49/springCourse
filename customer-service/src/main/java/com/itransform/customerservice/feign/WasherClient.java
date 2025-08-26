package com.itransform.customerservice.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.itransform.customerservice.dto.WasherDTO;

// 👇 Use service name registered in Eureka
@FeignClient(name = "WASHER-SERVICE")
public interface WasherClient {

    @GetMapping("/api/washers/{id}")
    WasherDTO getWasherById(@PathVariable("id") Long id); // Replace Object with WasherDTO if you have it

    @PutMapping("/api/washers/{id}")
    WasherDTO updateWasher(@PathVariable("id") Long id, @RequestBody WasherDTO washer);
    
}
