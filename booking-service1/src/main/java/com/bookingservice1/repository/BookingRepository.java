package com.bookingservice1.repository;

import com.bookingservice1.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByCustomerId(Long customerId);
    List<Booking> findByWasherId(Long washerId);
    List<Booking> findByStatus(String status);
    List<Booking> findByPaymentStatus(String paymentStatus);
    List<Booking> findByCustomerIdAndStatus(Long customerId, String status);
    List<Booking> findByWasherIdAndStatus(Long washerId, String status);
}
