package com.fruitshop.backend.repository;

import com.fruitshop.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Page<User> findByFullnameContainingIgnoreCase(String name, Pageable pageable);
    
    // For sorting by ID/Index, Pageable handles it.
    // Filtering by Status and Role
    Page<User> findByStatusAndRole(User.UserStatus status, User.Role role, Pageable pageable);
    Page<User> findByStatus(User.UserStatus status, Pageable pageable);
    Page<User> findByRole(User.Role role, Pageable pageable);
}
