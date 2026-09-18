package com.example.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CommentRequest {

    @NotNull(message = "Ticket ID is required")
    private Long ticketId;

    @NotBlank(message = "Comment content is required")
    private String content;

    public CommentRequest() {
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}