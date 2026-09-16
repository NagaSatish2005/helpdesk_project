package com.example.backend.controller;

import com.example.backend.dto.response.ApiResponse;
import com.example.backend.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getSummary() {

        Map<String, Long> summary = Map.of(
                "totalUsers", dashboardService.getTotalUsers(),
                "totalTickets", dashboardService.getTotalTickets(),
                "openTickets", dashboardService.getOpenTickets(),
                "inProgressTickets", dashboardService.getInProgressTickets(),
                "resolvedTickets", dashboardService.getResolvedTickets(),
                "closedTickets", dashboardService.getClosedTickets()
        );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Dashboard summary retrieved successfully",
                        summary
                )
        );
    }
}