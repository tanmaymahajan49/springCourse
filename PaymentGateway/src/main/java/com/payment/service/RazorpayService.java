package com.payment.service;

import com.payment.model.Payment;
import com.payment.repository.Repository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;

import java.time.LocalDateTime;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RazorpayService {
	
	@Autowired
	Repository repository;
	@Value("${razorpay.api.key}")
	private String apiKey;
	
	@Value("${razorpay.api.secret}")
	private String apiSecret;
	
	public String createOrder(Double amount) throws RazorpayException
	{
		RazorpayClient razorpayClient = new RazorpayClient(apiKey, apiSecret);
		JSONObject orderRequest = new JSONObject();
		orderRequest.put("amount", amount *100);
		orderRequest.put("currency", "INR");
//		orderRequest.put("receiptId", "YD");
//		
		Order order = razorpayClient.orders.create(orderRequest);
		return order.toString();
	}

	
	
	public Payment makePayment(Payment payment) {
		payment.setTransactionId(0);
		payment.setStatus("COMPLETE");
		payment.setTime(LocalDateTime.now());

		try {
			createOrder(payment.getAmount());
		} catch (RazorpayException e) {
			e.printStackTrace();
		}

		return repository.save(payment);
	}
}
