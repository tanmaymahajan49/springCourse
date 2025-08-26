package com.itransform.washerservice.repository;

import com.itransform.washerservice.entity.Washer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WasherRepository extends JpaRepository<Washer, Long> {
}
