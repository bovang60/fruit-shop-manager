package com.fruitshop.backend.service;

import com.fruitshop.backend.dto.ApiResponse;
import com.fruitshop.backend.dto.DashboardDto;

public interface DashboardService {
    ApiResponse<DashboardDto> getAdminDashboardStats();
}
