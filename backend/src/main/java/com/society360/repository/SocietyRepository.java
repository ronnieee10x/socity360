package com.society360.repository;

import com.society360.domain.society.Society;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface SocietyRepository extends JpaRepository<Society, UUID> {
    Optional<Society> findByCode(String code);
    Optional<Society> findByRegistrationNumber(String registrationNumber);
    boolean existsByCode(String code);
    boolean existsByRegistrationNumber(String registrationNumber);
}
