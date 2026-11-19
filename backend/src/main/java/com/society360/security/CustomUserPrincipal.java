package com.society360.security;

import com.society360.domain.auth.Role;
import com.society360.domain.auth.UserAccount;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public class CustomUserPrincipal implements UserDetails {

    private final UUID id;
    private final UUID societyId;
    private final String email;
    private final String password;
    private final String fullName;
    private final Role role;
    private final String status;
    private final Collection<? extends GrantedAuthority> authorities;

    public CustomUserPrincipal(UserAccount user) {
        this.id = user.getId();
        this.societyId = user.getSocietyId();
        this.email = user.getEmail();
        this.password = user.getPasswordHash();
        this.fullName = user.getFullName();
        this.role = user.getRole();
        this.status = user.getStatus();
        this.authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    }

    public UUID getId() {
        return id;
    }

    public UUID getSocietyId() {
        return societyId;
    }

    public String getFullName() {
        return fullName;
    }

    public Role getRole() {
        return role;
    }

    public String getStatus() {
        return status;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !"SUSPENDED".equalsIgnoreCase(status);
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return "ACTIVE".equalsIgnoreCase(status);
    }
}
