package com.society360.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateBuildingRequest {

    @NotBlank(message = "Building name is required")
    @Size(min = 1, max = 80)
    private String name;

    @Min(value = 1, message = "Total floors must be at least 1")
    private int totalFloors = 1;

    private String description;

    public CreateBuildingRequest() {}

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
