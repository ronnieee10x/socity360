package com.society360.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateWingRequest {

    @NotBlank(message = "Wing name is required")
    @Size(min = 1, max = 30)
    private String name;

    public CreateWingRequest() {}

    public CreateWingRequest(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
