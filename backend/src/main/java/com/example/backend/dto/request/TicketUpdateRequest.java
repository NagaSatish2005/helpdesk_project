package com.example.backend.dto.request;

import com.example.backend.model.enums.TicketCategory;
import com.example.backend.model.enums.TicketPriority;
import com.example.backend.model.enums.TicketStatus;

public class TicketUpdateRequest {

    private TicketStatus status;
    private TicketPriority priority;
    private TicketCategory category;
    private Long assignedToId;
    private boolean assignedToIdProvided;

    public TicketUpdateRequest() {
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public TicketPriority getPriority() {
        return priority;
    }

    public void setPriority(TicketPriority priority) {
        this.priority = priority;
    }

    public TicketCategory getCategory() {
        return category;
    }

    public void setCategory(TicketCategory category) {
        this.category = category;
    }

    public Long getAssignedToId() {
        return assignedToId;
    }

    public void setAssignedToId(Long assignedToId) {
        this.assignedToId = assignedToId;
        this.assignedToIdProvided = true;
    }

    public boolean isAssignedToIdProvided() {
        return assignedToIdProvided;
    }
}
