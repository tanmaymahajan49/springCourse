package com.adminservice.feign;

import com.adminservice.model.Booking;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(name = "BOOKING-SERVICE")
public interface BookingClient {

    @GetMapping("/bookings")
    List<Booking> getAllBookings();
}
