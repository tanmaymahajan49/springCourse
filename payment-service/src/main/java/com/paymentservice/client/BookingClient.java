// BookingClient.java
package com.paymentservice.client;

import com.paymentservice.model.Booking;  // Import the Booking model
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "booking-service")  // Replace with actual service name
public interface BookingClient {

    @GetMapping("/bookings/{id}")  // Endpoint of the Booking Service to fetch booking details
    Booking getBookingById(@PathVariable("id") Long id);
}
