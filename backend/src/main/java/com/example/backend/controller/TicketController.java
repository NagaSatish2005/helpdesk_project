package com.example.backend.controller;

import com.example.backend.dto.request.TicketRequest;
import com.example.backend.dto.request.TicketUpdateRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.TicketResponse;
import com.example.backend.service.TicketService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

    public TicketController(TicketService ticketService) {
        this.ticketService = ticketService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TicketResponse>> createTicket(
            @Valid @RequestBody TicketRequest request,
            Authentication authentication) {
        TicketResponse response = ticketService.createTicket(request, authentication.getName());
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(
                        true,
                        "Ticket created successfully",
                        response
                ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TicketResponse>> getTicket(@PathVariable Long id) {
        TicketResponse response = ticketService.getTicketById(id);
        return ResponseEntity
                .ok()
                .body(new ApiResponse<>(
                        true,
                        "Ticket retrieved successfully",
                        response
                ));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<TicketResponse>> updateTicket(
            @PathVariable Long id,
            @RequestBody TicketUpdateRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Ticket updated successfully",
                ticketService.updateTicket(id, request)
        ));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TicketResponse>>> getAllTickets() {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Tickets retrieved successfully",
                ticketService.getAllTickets()
        ));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<TicketResponse>>> getTicketsByUser(
            @PathVariable Long userId) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "User tickets retrieved successfully",
                ticketService.getTicketsByUser(userId)
        ));
    }
}