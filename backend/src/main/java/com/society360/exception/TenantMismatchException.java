package com.society360.exception;

public class TenantMismatchException extends RuntimeException {
    public TenantMismatchException(String message) {
        super(message);
    }
}
