package com.society360.domain.society;

import com.society360.domain.common.BaseEntity;
import jakarta.persistence.*;

@Entity
@Table(name = "societies")
public class Society extends BaseEntity {

    @Column(name = "code", nullable = false, unique = true, length = 30)
    private String code;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "registration_number", nullable = false, unique = true, length = 80)
    private String registrationNumber;

    @Column(name = "address_line", nullable = false, columnDefinition = "TEXT")
    private String addressLine;

    @Column(name = "city", nullable = false, length = 80)
    private String city;

    @Column(name = "state", nullable = false, length = 80)
    private String state;

    @Column(name = "pin_code", nullable = false, length = 12)
    private String pinCode;

    @Column(name = "status", nullable = false, length = 25)
    private String status = "ACTIVE"; // ACTIVE, SUSPENDED, INACTIVE

    @Column(name = "settings", columnDefinition = "TEXT")
    private String settings;

    public Society() {}

    public Society(String code, String name, String registrationNumber, String addressLine, String city, String state, String pinCode) {
        this.code = code;
        this.name = name;
        this.registrationNumber = registrationNumber;
        this.addressLine = addressLine;
        this.city = city;
        this.state = state;
        this.pinCode = pinCode;
        this.status = "ACTIVE";
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getAddressLine() {
        return addressLine;
    }

    public void setAddressLine(String addressLine) {
        this.addressLine = addressLine;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPinCode() {
        return pinCode;
    }

    public void setPinCode(String pinCode) {
        this.pinCode = pinCode;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getSettings() {
        return settings;
    }

    public void setSettings(String settings) {
        this.settings = settings;
    }
}
