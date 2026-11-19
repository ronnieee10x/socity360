package com.society360.repository;

import com.society360.domain.society.SocietyApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SocietyApplicationRepository extends JpaRepository<SocietyApplication, UUID> {
    List<SocietyApplication> findAllByStatus(String status);
    List<SocietyApplication> findAllByOrderByCreatedAtDesc();
    boolean existsByRegistrationNumber(String registrationNumber);
}
