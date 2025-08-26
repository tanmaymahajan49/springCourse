package com.itransform.customerservice.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.itransform.customerservice.dto.PaymentDTO;

@FeignClient("PAYMENTGATEWAY")

public interface paymentInterface {

	@PostMapping("payments/pay")
	public ResponseEntity<PaymentDTO> pay(@RequestBody PaymentDTO payment);
}
