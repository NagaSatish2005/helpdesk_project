package com.example.backend.controller;

import com.example.backend.dto.request.DepartmentRequest;
import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.DepartmentResponse;
import com.example.backend.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DepartmentResponse>>> getDepartments() {
        return ResponseEntity.ok(new ApiResponse<>(
                true, "Departments retrieved successfully", departmentService.getAllDepartments()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DepartmentResponse>> getDepartment(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(
                true, "Department retrieved successfully", departmentService.getDepartment(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DepartmentResponse>> createDepartment(
            @Valid @RequestBody DepartmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(
                true, "Department created successfully", departmentService.createDepartment(request)));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<DepartmentResponse>> updateDepartment(
            @PathVariable Long id,
            @Valid @RequestBody DepartmentRequest request) {
        return ResponseEntity.ok(new ApiResponse<>(
                true, "Department updated successfully", departmentService.updateDepartment(id, request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Department deleted successfully", null));
    }

    @PatchMapping("/{departmentId}/staff/{userId}")
    public ResponseEntity<ApiResponse<DepartmentResponse>> assignStaff(
            @PathVariable Long departmentId,
            @PathVariable Long userId) {
        return ResponseEntity.ok(new ApiResponse<>(
                true, "Staff assigned successfully", departmentService.assignStaff(departmentId, userId)));
    }

    @DeleteMapping("/{departmentId}/staff/{userId}")
    public ResponseEntity<ApiResponse<DepartmentResponse>> removeStaff(
            @PathVariable Long departmentId,
            @PathVariable Long userId) {
        return ResponseEntity.ok(new ApiResponse<>(
                true, "Staff removed successfully", departmentService.removeStaff(departmentId, userId)));
    }

    @org.springframework.web.bind.annotation.ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleDepartmentError(IllegalArgumentException exception) {
        HttpStatus status = exception.getMessage() != null && exception.getMessage().endsWith("not found")
                ? HttpStatus.NOT_FOUND
                : HttpStatus.CONFLICT;
        return ResponseEntity.status(status).body(new ApiResponse<>(false, exception.getMessage(), null));
    }

    @org.springframework.web.bind.annotation.ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleConstraintError() {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiResponse<>(
                false, "Department cannot be deleted while related records still exist.", null));
    }
}
