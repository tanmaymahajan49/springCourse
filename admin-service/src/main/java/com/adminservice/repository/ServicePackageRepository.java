package com.adminservice.repository;

import com.adminservice.entity.ServicePackage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServicePackageRepository extends JpaRepository<ServicePackage, Long> {
    List<ServicePackage> findByIsActiveTrue();
    List<ServicePackage> findByNameContainingIgnoreCase(String name);
}
