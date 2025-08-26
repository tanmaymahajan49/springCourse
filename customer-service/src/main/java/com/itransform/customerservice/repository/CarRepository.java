package com.itransform.customerservice.repository;

import com.itransform.customerservice.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
    List<Car> findByCustomerId(Long customerId);
    List<Car> findByLicensePlate(String licensePlate);
}
