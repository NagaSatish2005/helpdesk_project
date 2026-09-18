package com.example.backend.controller;

import com.example.backend.dto.request.CommentRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.CommentResponse;
import com.example.backend.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CommentResponse>> createComment(
            @Valid @RequestBody CommentRequest request,
            Authentication authentication) {
        CommentResponse response = commentService.createComment(
                request,
                authentication.getName()
        );
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(
                        true,
                        "Comment created successfully",
                        response
                ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CommentResponse>> getComment(
            @PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Comment retrieved successfully",
                commentService.getCommentById(id)
        ));
    }

    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getCommentsByTicket(
            @PathVariable Long ticketId) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Ticket comments retrieved successfully",
                commentService.getCommentsByTicket(ticketId)
        ));
    }
}