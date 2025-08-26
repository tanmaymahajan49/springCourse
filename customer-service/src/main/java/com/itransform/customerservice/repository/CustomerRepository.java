package com.itransform.customerservice.repository;

import com.itransform.customerservice.dto.CustomerDTO;
import com.itransform.customerservice.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByEmail(String email);
    boolean existsByEmail(String email);
    List<CustomerDTO>findByFullName(String name);
    
}