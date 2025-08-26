package com.spsec.Spring_Security;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
public class HelloController {
	
	@GetMapping("/")
	public String show(HttpServletRequest req) {
		String ID = req.getSession().getId();
		return " Spring_Security page " + ID;
//		return " Spring_Security page ";
	}

}
