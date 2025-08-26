package com.adminservice.repository;

import com.adminservice.entity.Promo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PromoRepository extends JpaRepository<Promo, Long> {
    List<Promo> findByIsActiveTrue();
    Optional<Promo> findByCodeAndIsActiveTrue(String code);
    List<Promo> findByCodeContainingIgnoreCase(String code);
}
