package com.payment.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.payment.model.Payment;
import com.payment.service.RazorpayService;
import com.razorpay.RazorpayException;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/payments")
@CrossOrigin(origins = "*") // Allow all origins for testing
public class PaymentController {
	@Autowired
	private RazorpayService razorpayService;

	@PostMapping("/pay")
	public Payment pay(@RequestBody Payment payment) {
		return razorpayService.makePayment(payment);
	}

//	@PostMapping("/create-order")
//	public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> orderRequest) {
//		try {
//			Double amount = Double.valueOf(orderRequest.get("amount").toString());
//			String currency = orderRequest.getOrDefault("currency", "INR").toString();
//			String receipt = orderRequest.getOrDefault("receipt", "receipt_" + System.currentTimeMillis()).toString();
//
//			// Create order using RazorpayService
//			String orderResponse = razorpayService.createOrder(amount);
//
//			// Parse the order response and return structured data
//			Map<String, Object> response = new HashMap<>();
//			response.put("success", true);
//			response.put("orderId", extractOrderId(orderResponse));
//			response.put("amount", amount);
//			response.put("currency", currency);
//			response.put("receipt", receipt);
//			response.put("rawResponse", orderResponse);
//
//			return ResponseEntity.ok(response);
//		} catch (RazorpayException e) {
//			Map<String, Object> errorResponse = new HashMap<>();
//			errorResponse.put("success", false);
//			errorResponse.put("error", e.getMessage());
//			return ResponseEntity.badRequest().body(errorResponse);
//		} catch (Exception e) {
//			Map<String, Object> errorResponse = new HashMap<>();
//			errorResponse.put("success", false);
//			errorResponse.put("error", "Internal server error: " + e.getMessage());
//			return ResponseEntity.internalServerError().body(errorResponse);
//		}
//	}

	@GetMapping("/health")
	public ResponseEntity<Map<String, String>> health() {
		Map<String, String> response = new HashMap<>();
		response.put("status", "UP");
		response.put("service", "Payment Gateway");
		response.put("timestamp", String.valueOf(System.currentTimeMillis()));
		return ResponseEntity.ok(response);
	}

	@GetMapping("/actuator/health")
	public ResponseEntity<Map<String, String>> actuatorHealth() {
		Map<String, String> response = new HashMap<>();
		response.put("status", "UP");
		return ResponseEntity.ok(response);
	}

	private String extractOrderId(String orderResponse) {
		// Simple extraction of order ID from JSON response
		// In production, use proper JSON parsing
		try {
			int startIndex = orderResponse.indexOf("\"id\":\"") + 6;
			int endIndex = orderResponse.indexOf("\"", startIndex);
			return orderResponse.substring(startIndex, endIndex);
		} catch (Exception e) {
			return "order_" + System.currentTimeMillis();
		}
	}
}
