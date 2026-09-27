package com.example.backend.dto.response;

import java.util.List;

public class DepartmentResponse {

    private Long id;
    private String name;
    private String description;
    private boolean active;
    private List<UserResponse> staffMembers;

    public DepartmentResponse() {
    }

    public DepartmentResponse(Long id, String name, String description, boolean active, List<UserResponse> staffMembers) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.active = active;
        this.staffMembers = staffMembers;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public boolean isActive() {
        return active;
    }

    public List<UserResponse> getStaffMembers() {
        return staffMembers;
    }
}
