package com.payment.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.payment.model.Payment;

public interface Repository extends JpaRepository<Payment, Integer> {
//    List<Payment> findByWasherId(int WasherId);
}
