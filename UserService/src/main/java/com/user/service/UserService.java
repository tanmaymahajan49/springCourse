package com.user.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.user.feign.UserDealerInterface;
import com.user.feign.UserFarmerInterface;
import com.user.model.User;
import com.user.model.UserDto;
import com.user.repo.UserRepo;

@Service
public class UserService {

	private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

	@Autowired
	UserRepo userRepo;

	@Autowired
	UserFarmerInterface farmer_service;

	@Autowired
	UserDealerInterface dealer_service;
	@Autowired
	private JwtService jwtService;

	@Autowired
	AuthenticationManager authManager;

	public ResponseEntity<String> registerCustomer(UserDto userDto) {

		User user = new User(userDto.getEmail(), encoder.encode(userDto.getPassword()), "CUSTOMER");

		User saved = userRepo.save(user);
		if (saved == null) {
			
			System.out.println("HELLO 2");
			
			return new ResponseEntity<>("user registration failed", HttpStatus.INTERNAL_SERVER_ERROR);
		}
		System.out.println("HELLO 3");
		
		return farmer_service.registerCustomer(userDto);

	}

	public ResponseEntity<String> registerWasher(UserDto userDto) {
		User user = new User(userDto.getEmail(), encoder.encode(userDto.getPassword()), "WASHER");

		User saved = userRepo.save(user);
		if (saved == null) {
			return new ResponseEntity<>("user registration failed", HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return dealer_service.registerWasher(userDto);

	}

	public ResponseEntity<String> login(User loginUser) {
		Authentication authentication = authManager
				.authenticate(new UsernamePasswordAuthenticationToken(loginUser.getEmail(), loginUser.getPassword()));
		if (authentication.isAuthenticated()) {
			User user = userRepo.findByEmail(loginUser.getEmail());
			String token = jwtService.generateToken(user); // includes role
			return ResponseEntity.ok(token);
		} else {
			throw new UsernameNotFoundException("Invalid user request!");
		}
	}

	public ResponseEntity<List<User>> getAllUsers() {
		try {
			return new ResponseEntity<>(userRepo.findAll(), HttpStatus.OK);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return new ResponseEntity<>(new ArrayList<>(), HttpStatus.NOT_FOUND);
	}

}
