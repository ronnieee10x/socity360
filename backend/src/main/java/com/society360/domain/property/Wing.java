package com.society360.domain.property;

import com.society360.domain.common.TenantBaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.util.UUID;

@Entity
@Table(name = "wings", uniqueConstraints = {
        @UniqueConstraint(name = "uq_building_wing", columnNames = {"building_id", "name"})
})
public class Wing extends TenantBaseEntity {

    @Column(name = "building_id", nullable = false)
    private UUID buildingId;

    @Column(name = "name", nullable = false, length = 30)
    private String name;

    public Wing() {}

    public Wing(UUID buildingId, String name) {
        this.buildingId = buildingId;
        this.name = name;
    }

    public UUID getBuildingId() {
        return buildingId;
    }

    public void setBuildingId(UUID buildingId) {
        this.buildingId = buildingId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
