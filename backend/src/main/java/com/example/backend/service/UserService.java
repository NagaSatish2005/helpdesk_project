package com.example.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.backend.dto.request.ChangePasswordRequest;
import com.example.backend.dto.request.CreateStaffRequest;
import com.example.backend.dto.request.UpdateUserRequest;
import com.example.backend.model.Ticket;
import com.example.backend.model.User;
import com.example.backend.model.enums.UserRole;
import com.example.backend.repository.AttachmentRepository;
import com.example.backend.repository.CommentRepository;
import com.example.backend.repository.TicketRepository;
import com.example.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AttachmentRepository attachmentRepository;
    private final CommentRepository commentRepository;
    private final TicketRepository ticketRepository;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AttachmentRepository attachmentRepository,
            CommentRepository commentRepository,
            TicketRepository ticketRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.attachmentRepository = attachmentRepository;
        this.commentRepository = commentRepository;
        this.ticketRepository = ticketRepository;
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

    public void changePassword(String userEmail, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("New password and confirmation must match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
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
        if (request.getRole() != UserRole.STAFF) {
            user.setDepartment(null);
        }

        return userRepository.save(user);
    }

    public User updateUserStatus(Long id, boolean active) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        user.setActive(active);
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Ticket> requestedTickets = ticketRepository.findByRequesterId(id);
        List<Ticket> assignedTickets = ticketRepository.findByAssignedToId(id);

        assignedTickets.forEach(ticket -> ticket.setAssignedTo(null));
        ticketRepository.saveAll(assignedTickets);
        ticketRepository.flush();

        attachmentRepository.deleteAll(attachmentRepository.findByUploadedById(id));
        commentRepository.deleteAll(commentRepository.findByAuthorId(id));
        attachmentRepository.flush();
        commentRepository.flush();

        requestedTickets.forEach(ticket -> {
            attachmentRepository.deleteAll(attachmentRepository.findByTicketIdOrderByUploadedAtAsc(ticket.getId()));
            commentRepository.deleteAll(commentRepository.findByTicket(ticket));
            ticketRepository.delete(ticket);
        });
        user.setDepartment(null);
        userRepository.save(user);
        userRepository.flush();

        userRepository.delete(user);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}