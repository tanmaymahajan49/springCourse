package com.spsec.Spring_Security;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<Users, Integer>{

	Users findByUsername(String username);

}
