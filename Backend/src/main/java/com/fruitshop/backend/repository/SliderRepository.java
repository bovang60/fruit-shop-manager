package com.fruitshop.backend.repository;

import com.fruitshop.backend.model.Slider;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SliderRepository extends JpaRepository<Slider, Integer> {
    List<Slider> findByStatusTrueOrderByCreatedAtDesc();
    Page<Slider> findByStatus(Boolean status, Pageable pageable);
    long countByStatusTrue();
}
