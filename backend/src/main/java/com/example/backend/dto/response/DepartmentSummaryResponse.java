package com.example.backend.dto.response;

public class DepartmentSummaryResponse {

    private Long id;
    private String name;

    public DepartmentSummaryResponse(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}