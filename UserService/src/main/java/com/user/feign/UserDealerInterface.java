package com.user.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.user.model.UserDto;

@FeignClient("WASHER-SERVICE")
public interface UserDealerInterface {

	 @PostMapping("/api/washers/register")
	    public ResponseEntity<String> registerWasher(@RequestBody UserDto dealer);
	    
}
