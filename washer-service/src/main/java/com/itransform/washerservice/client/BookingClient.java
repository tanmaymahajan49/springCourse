package com.itransform.washerservice.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "booking-service", contextId = "washer-booking-client")
public interface BookingClient {

    @GetMapping("/api/bookings")
    List<Object> getAllBookings();

    @GetMapping("/api/bookings/status/{status}")
    List<Object> getBookingsByStatus(@PathVariable("status") String status);

    @GetMapping("/api/bookings/washer/{washerId}")
    List<Object> getBookingsByWasher(@PathVariable("washerId") Long washerId);

    @PutMapping("/api/bookings/{id}/status")
    Object updateBookingStatus(@PathVariable("id") Long id, @RequestParam("status") String status);
}
