package com.society360.service;

import com.society360.domain.society.Society;
import com.society360.domain.society.SocietyApplication;
import com.society360.dto.request.SocietyRegistrationRequest;

import java.util.List;

public interface SocietyOnboardingService {
    SocietyApplication submitApplication(SocietyRegistrationRequest request);
    List<Society> getPublicActiveSocieties();
}
