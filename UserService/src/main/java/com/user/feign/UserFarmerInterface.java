package com.user.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.user.model.UserDto;

import jakarta.validation.Valid;

@FeignClient(name="CUSTOMER-SERVICE")

public interface UserFarmerInterface {

	 @PostMapping("/api/customers/register")
	    public ResponseEntity<String> registerCustomer(@Valid @RequestBody UserDto farmer);
	        
}
