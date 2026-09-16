package com.example.backend.controller;

import com.example.backend.dto.request.CommentRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.model.Comment;
import com.example.backend.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<String>> createComment(
            @Valid @RequestBody CommentRequest request) {

        return ResponseEntity
                .status(HttpStatus.NOT_IMPLEMENTED)
                .body(new ApiResponse<>(
                        false,
                        "Comment creation will be implemented with authentication",
                        null
                ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> getComment(
            @PathVariable Long id) {

        return ResponseEntity
                .status(HttpStatus.NOT_IMPLEMENTED)
                .body(new ApiResponse<>(
                        false,
                        "Comment retrieval will be implemented",
                        null
                ));
    }
}