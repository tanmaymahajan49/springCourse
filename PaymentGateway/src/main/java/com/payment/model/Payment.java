package com.payment.model;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int transactionId;
    private int washerId;
    private int customerId;
    private double amount;
    private String status; 
    private LocalDateTime time = LocalDateTime.now();
}
