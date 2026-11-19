package com.society360.repository;

import com.society360.domain.auth.Role;
import com.society360.domain.auth.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserAccountRepository extends JpaRepository<UserAccount, UUID> {
    Optional<UserAccount> findByEmail(String email);
    boolean existsByEmail(String email);
    List<UserAccount> findAllBySocietyId(UUID societyId);
    List<UserAccount> findAllBySocietyIdAndRole(UUID societyId, Role role);
    long countBySocietyId(UUID societyId);
}
