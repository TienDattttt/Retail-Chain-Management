package com.rsm.retailbackend.feature.auth.repository;

import com.rsm.retailbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUserName(String userName);
    boolean existsByUserName(String userName);
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.branch WHERE u.userName = :userName")
    Optional<User> findByUserNameWithBranch(@Param("userName") String userName);
}
