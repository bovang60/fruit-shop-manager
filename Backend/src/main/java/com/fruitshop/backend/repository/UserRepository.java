package com.fruitshop.backend.repository;

import com.fruitshop.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);
    Page<User> findByRole(User.Role role, Pageable pageable);
    Page<User> findByStatusAndRole(User.UserStatus status, User.Role role, Pageable pageable);
    Page<User> findByRoleNot(User.Role role, Pageable pageable);
    Page<User> findByFullNameContainingIgnoreCaseAndRoleNot(String name, User.Role role, Pageable pageable);
    Page<User> findByStatusAndRoleNot(User.UserStatus status, User.Role role, Pageable pageable);
    Page<User> findByFullNameContainingIgnoreCaseAndStatusAndRoleNot(String name, User.UserStatus status, User.Role role, Pageable pageable);
    long countByStatus(User.UserStatus status);
}
