package com.example.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.dto.request.CreateStaffRequest;
import com.example.backend.dto.request.UpdateUserRequest;
import com.example.backend.model.User;
import com.example.backend.model.enums.UserRole;
import com.example.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User createStaff(CreateStaffRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                UserRole.STAFF
        );

        return userRepository.save(user);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public User updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        userRepository.findByEmail(request.getEmail())
                .filter(existingUser -> !existingUser.getId().equals(id))
                .ifPresent(existingUser -> {
                    throw new IllegalArgumentException("Email is already registered");
                });

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());

        return userRepository.save(user);
    }

    public User updateUserStatus(Long id, boolean active) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setActive(active);
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
		if (!userRepository.existsById(id)) {
			throw new IllegalArgumentException("User not found");
		}

        userRepository.deleteById(id);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}