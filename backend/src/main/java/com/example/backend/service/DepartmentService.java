package com.example.backend.service;

import com.example.backend.dto.request.DepartmentRequest;
import com.example.backend.dto.response.DepartmentResponse;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.model.Department;
import com.example.backend.model.User;
import com.example.backend.model.enums.UserRole;
import com.example.backend.repository.DepartmentRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;

    public DepartmentService(DepartmentRepository departmentRepository, UserRepository userRepository) {
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<DepartmentResponse> getAllDepartments() {
        return departmentRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public DepartmentResponse getDepartment(Long id) {
        return toResponse(findDepartment(id));
    }

    @Transactional
    public DepartmentResponse createDepartment(DepartmentRequest request) {
        String name = request.getName().trim();
        if (departmentRepository.existsByNameIgnoreCase(name)) {
            throw new IllegalArgumentException("Department name is already in use");
        }

        boolean active = request.getActive() == null || request.getActive();
        return toResponse(departmentRepository.save(
                new Department(name, normalizeDescription(request.getDescription()), active)));
    }

    @Transactional
    public DepartmentResponse updateDepartment(Long id, DepartmentRequest request) {
        Department department = findDepartment(id);
        String name = request.getName().trim();
        departmentRepository.findByNameIgnoreCase(name)
            .filter(existing -> !existing.getId().equals(id))
            .ifPresent(existing -> {
                    throw new IllegalArgumentException("Department name is already in use");
                });

        department.setName(name);
        department.setDescription(normalizeDescription(request.getDescription()));
        if (request.getActive() != null) {
            department.setActive(request.getActive());
        }
        return toResponse(departmentRepository.save(department));
    }

    @Transactional
    public void deleteDepartment(Long id) {
        Department department = findDepartment(id);
        if (userRepository.countByDepartmentIdAndActiveTrue(id) > 0
                || !userRepository.findByDepartmentId(id).isEmpty()) {
            throw new IllegalArgumentException("Department cannot be deleted while staff are assigned.");
        }
        departmentRepository.delete(department);
    }

    @Transactional
    public DepartmentResponse assignStaff(Long departmentId, Long userId) {
        Department department = findDepartment(departmentId);
        User user = findUser(userId);
        if (user.getRole() != UserRole.STAFF) {
            throw new IllegalArgumentException("Only Staff users can be assigned to departments.");
        }
        user.setDepartment(department);
        userRepository.save(user);
        return toResponse(department);
    }

    @Transactional
    public DepartmentResponse removeStaff(Long departmentId, Long userId) {
        Department department = findDepartment(departmentId);
        User user = findUser(userId);
        if (user.getDepartment() == null || !departmentId.equals(user.getDepartment().getId())) {
            throw new IllegalArgumentException("Staff user is not assigned to this department.");
        }
        user.setDepartment(null);
        userRepository.save(user);
        return toResponse(department);
    }

    private Department findDepartment(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Department not found"));
    }

    private User findUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private DepartmentResponse toResponse(Department department) {
        List<UserResponse> staffMembers = userRepository.findByDepartmentId(department.getId()).stream()
                .filter(user -> user.getRole() == UserRole.STAFF)
                .map(user -> new UserResponse(
                        user.getId(), user.getName(), user.getEmail(), user.getRole().name(), user.isActive()))
                .toList();
        return new DepartmentResponse(
                department.getId(),
                department.getName(),
                department.getDescription(),
                department.isActive(),
                staffMembers);
    }

    private String normalizeDescription(String description) {
        return description == null ? "" : description.trim();
    }
}
