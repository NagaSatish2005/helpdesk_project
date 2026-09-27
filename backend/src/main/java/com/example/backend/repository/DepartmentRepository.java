package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

import com.example.backend.model.Department;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

    boolean existsByNameIgnoreCase(String name);

    Optional<Department> findByNameIgnoreCase(String name);
}
