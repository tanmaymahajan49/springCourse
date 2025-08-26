package com.bookingservice1.repository;

import com.bookingservice1.entity.Package;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PackageRepository extends JpaRepository<Package, Long> {
    List<Package> findByIsActiveTrue();
    List<Package> findByNameContainingIgnoreCase(String name);
}
