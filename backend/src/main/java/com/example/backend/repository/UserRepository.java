package com.example.backend.repository;

import com.example.backend.model.User;
import com.example.backend.model.enums.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    @EntityGraph(attributePaths = "department")
    List<User> findAll();

    List<User> findByDepartmentId(Long departmentId);

    List<User> findByDepartmentIdAndRoleAndActiveTrue(Long departmentId, UserRole role);

    long countByDepartmentIdAndActiveTrue(Long departmentId);

    boolean existsByEmail(String email);
}