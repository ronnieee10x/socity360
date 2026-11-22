package com.society360.config;

import com.society360.domain.auth.Role;
import com.society360.domain.auth.UserAccount;
import com.society360.repository.UserAccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class SuperAdminBootstrapDataLoader implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(SuperAdminBootstrapDataLoader.class);

    private final UserAccountRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${society360.superadmin.email:superadmin@society360.com}")
    private String superAdminEmail;

    @Value("${society360.superadmin.password:Admin@12345}")
    private String superAdminPassword;

    @Value("${society360.superadmin.name:Platform Super Administrator}")
    private String superAdminName;

    @Value("${society360.superadmin.phone:+1-800-555-0199}")
    private String superAdminPhone;

    public SuperAdminBootstrapDataLoader(
            UserAccountRepository userRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail(superAdminEmail).isPresent()) {
            logger.info("Platform Super Admin [{}] already exists. Skipping bootstrap initialization.", superAdminEmail);
            return;
        }

        logger.info("Bootstrapping initial Platform Super Admin account [{}]...", superAdminEmail);

        UserAccount superAdmin = new UserAccount(
                null, // Super Admin operates across all societies
                superAdminName,
                superAdminEmail,
                superAdminPhone,
                passwordEncoder.encode(superAdminPassword),
                Role.PLATFORM_SUPER_ADMIN
        );
        superAdmin.setStatus("ACTIVE");

        userRepository.save(superAdmin);
        logger.info("Platform Super Admin [{}] initialized successfully.", superAdminEmail);
    }
}
