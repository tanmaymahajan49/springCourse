package com.bookingservice1.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.bookingservice1.dto.WasherDTO;

@FeignClient(name = "washer-service", contextId = "booking-washer-client")  // Name of the washer service registered in Eureka
public interface WasherClient {

    @GetMapping("/api/washers/{washerId}")
    WasherDTO getWasherById(@PathVariable("washerId") Long washerId);
}
