package com.user.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.user.model.User;
import com.user.model.UserDto;
import com.user.service.UserService;

@RestController
@RequestMapping("/user")
public class UserController {

	@Autowired
	UserService userService;

	@GetMapping("/allUsers")
	public ResponseEntity<List<User>> getAllUsers() {
		return userService.getAllUsers();
	}

	@PostMapping("/customer-register")
	public ResponseEntity<String> registerCustomer(@RequestBody UserDto userDto) {
		System.out.println("HELLO 1");
		return userService.registerCustomer(userDto);
	}

	@PostMapping("/washer-register")
	public ResponseEntity<String> registerWasher(@RequestBody UserDto userDto) {
		return userService.registerWasher(userDto);
	}

	@PostMapping("/login")
	public ResponseEntity<String> login(@RequestBody User user) {
		return userService.login(user);
	}

}
