package com.spsec.Spring_Security;

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;


@RestController
public class StudentController {
	@Autowired
	UserRepo repo;
	
	private List<Student> students = new ArrayList<>(List.of(
			new Student(1, "pen", 100),
			new Student(2, "eraser", 50),
			new Student(3, "maggi", 12)
			));
	
	@GetMapping("/student")
	public List<Student> getStudent() {
		return students;
	}
	
	@GetMapping("/token")
	public CsrfToken getToken(HttpServletRequest req) {
		return (CsrfToken) req.getAttribute("_csrf");
	}
	
	@PostMapping("/student")
	public Student addstudent(@RequestBody Student student) {
		students.add(student);
		return student;
	}
	
	@DeleteMapping("/student/{id}")
	public void deleteStudent(@PathVariable int id) {
		repo.deleteById(id);
	}

}
