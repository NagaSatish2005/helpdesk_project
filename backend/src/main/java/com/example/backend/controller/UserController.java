package com.example.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.request.CreateStaffRequest;
import com.example.backend.dto.request.UpdateUserRequest;
import com.example.backend.dto.request.UpdateUserStatusRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.model.User;
import com.example.backend.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/staff")
    public ResponseEntity<ApiResponse<UserResponse>> createStaff(
            @Valid @RequestBody CreateStaffRequest request) {

        User user = userService.createStaff(request);
        UserResponse response = new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.isActive()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse<>(
                        true,
                        "Staff user created successfully",
                        response
                ));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleStaffCreationError(
            IllegalArgumentException exception) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(new ApiResponse<>(
                        false,
                        exception.getMessage(),
                        null
                ));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(
            @PathVariable Long id) {

        User user = userService.getUserById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserResponse response = new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.isActive()
        );

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "User retrieved successfully",
                        response
                )
        );
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {

        try {
            User user = userService.updateUser(id, request);
            UserResponse response = new UserResponse(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                user.getRole().name(),
                user.isActive()
            );

            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "User updated successfully",
                            response
                    )
            );
        } catch (IllegalArgumentException exception) {
            HttpStatus status = "User not found".equals(exception.getMessage())
                    ? HttpStatus.NOT_FOUND
                    : HttpStatus.CONFLICT;

            return ResponseEntity
                    .status(status)
                    .body(new ApiResponse<>(
                            false,
                            exception.getMessage(),
                            null
                    ));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserStatus(
            @PathVariable Long id,
            @RequestBody UpdateUserStatusRequest request) {

        try {
            User user = userService.updateUserStatus(id, request.isActive());
            UserResponse response = new UserResponse(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    user.getRole().name(),
                    user.isActive()
            );

            return ResponseEntity.ok(
                    new ApiResponse<>(
                            true,
                            "User status updated successfully",
                            response
                    ));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(
                            false,
                            exception.getMessage(),
                            null
                    ));
        }
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {

        List<UserResponse> users = userService.getAllUsers()
                .stream()
                .map(user -> new UserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getRole().name(),
                        user.isActive()
                ))
                .toList();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Users retrieved successfully",
                        users
                )
        );
    }

        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
                userService.deleteUser(id);
                return ResponseEntity.ok(new ApiResponse<>(
                                true,
                                "User deleted successfully",
                                null
                ));
        }
}