package com.society360.domain.property;

import com.society360.domain.common.TenantBaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "buildings", uniqueConstraints = {
        @UniqueConstraint(name = "uq_society_building", columnNames = {"society_id", "name"})
})
public class Building extends TenantBaseEntity {

    @Column(name = "name", nullable = false, length = 80)
    private String name;

    @Column(name = "total_floors", nullable = false)
    private int totalFloors = 1;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    public Building() {}

    public Building(String name, int totalFloors, String description) {
        this.name = name;
        this.totalFloors = totalFloors;
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getTotalFloors() {
        return totalFloors;
    }

    public void setTotalFloors(int totalFloors) {
        this.totalFloors = totalFloors;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
