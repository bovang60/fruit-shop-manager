package com.fruitshop.backend.repository;

import com.fruitshop.backend.model.PendingRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PendingRegistrationRepository extends JpaRepository<PendingRegistration, Integer> {
    Optional<PendingRegistration> findByEmailAndIsVerifiedFalse(String email);

    void deleteByExpiryTimeBefore(LocalDateTime time);
}
