package com.example.backend.controller;

import java.util.List;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.request.ChangePasswordRequest;
import com.example.backend.dto.request.CreateStaffRequest;
import com.example.backend.dto.request.UpdateMyProfileRequest;
import com.example.backend.dto.request.UpdateUserRequest;
import com.example.backend.dto.request.UpdateUserStatusRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
        private final UserRepository userRepository;

        public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
                this.userRepository = userRepository;
    }

    @PostMapping("/staff")
    public ResponseEntity<ApiResponse<UserResponse>> createStaff(
            @Valid @RequestBody CreateStaffRequest request) {

        User user = userService.createStaff(request);
        UserResponse response = toUserResponse(user);

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

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDeleteConstraintError(
            DataIntegrityViolationException exception) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(new ApiResponse<>(
                        false,
                        "Unable to delete user because related records could not be removed.",
                        null
                ));
    }


    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMyProfile(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Authenticated user not found", null));
        }

        UserResponse response = toUserResponse(user);

        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Profile retrieved successfully",
                response
        ));
    }

    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateMyProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateMyProfileRequest request) {
        User user = userRepository.findByEmail(authentication.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse<>(false, "Authenticated user not found", null));
        }

        user.setName(request.getName());
        User updatedUser = userRepository.save(user);
        UserResponse response = new UserResponse(
                updatedUser.getId(),
                updatedUser.getName(),
                updatedUser.getEmail(),
                updatedUser.getRole().name(),
                updatedUser.isActive()
        );

        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Profile updated successfully",
                response
        ));
    }

        @PatchMapping("/me/password")
        public ResponseEntity<ApiResponse<Void>> changeMyPassword(
                        Authentication authentication,
                        @Valid @RequestBody ChangePasswordRequest request) {
                try {
                        userService.changePassword(authentication.getName(), request);
                        return ResponseEntity.ok(new ApiResponse<>(
                                        true,
                                        "Password updated successfully",
                                        null
                        ));
                } catch (IllegalArgumentException exception) {
                        HttpStatus status = "Authenticated user not found".equals(exception.getMessage())
                                        ? HttpStatus.NOT_FOUND
                                        : HttpStatus.BAD_REQUEST;

                        return ResponseEntity
                                        .status(status)
                                        .body(new ApiResponse<>(false, exception.getMessage(), null));
                }
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
                .map(this::toUserResponse)
                .toList();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Users retrieved successfully",
                        users
                )
        );
    }

        private UserResponse toUserResponse(User user) {
                return new UserResponse(
                                user.getId(),
                                user.getName(),
                                user.getEmail(),
                                user.getRole().name(),
                                user.isActive(),
                                user.getDepartment() == null ? null : user.getDepartment().getId(),
                                user.getDepartment() == null ? null : user.getDepartment().getName()
                );
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<ApiResponse<Void>> deleteUser(
                        @PathVariable Long id,
                        Authentication authentication) {
                boolean isAdmin = authentication != null
                                && authentication.getAuthorities().stream()
                                                .anyMatch(authority -> "ROLE_ADMIN"
                                                                .equals(authority.getAuthority()));

                if (!isAdmin) {
                        return ResponseEntity
                                        .status(HttpStatus.FORBIDDEN)
                                        .body(new ApiResponse<>(
                                                        false,
                                                        "Only administrators can delete users.",
                                                        null
                                        ));
                }

                userService.deleteUser(id);
                return ResponseEntity.ok(new ApiResponse<>(
                                true,
                                "User deleted successfully",
                                null
                ));
        }
}