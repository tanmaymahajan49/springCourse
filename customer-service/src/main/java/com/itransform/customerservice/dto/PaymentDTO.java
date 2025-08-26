package com.itransform.customerservice.dto;

import java.time.LocalDateTime;

import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
	
    private int transactionId;
    private int washerId;
    private int customerId;
    private double amount;
    private String status; 
    private LocalDateTime time = LocalDateTime.now();
}
