package com.society360.domain.common;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import java.util.UUID;

@MappedSuperclass
public abstract class TenantBaseEntity extends BaseEntity {

    @Column(name = "society_id", nullable = false)
    private UUID societyId;

    public UUID getSocietyId() {
        return societyId;
    }

    public void setSocietyId(UUID societyId) {
        this.societyId = societyId;
    }
}
