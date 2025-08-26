package com.bookingservice1.repository;

import com.bookingservice1.entity.AddOn;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddOnRepository extends JpaRepository<AddOn, Long> {
    List<AddOn> findByIsActiveTrue();
    List<AddOn> findByNameContainingIgnoreCase(String name);
}
