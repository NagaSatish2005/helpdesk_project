package com.example.backend.service;

import com.example.backend.dto.request.CommentRequest;
import com.example.backend.dto.response.CommentResponse;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.model.Comment;
import com.example.backend.model.Ticket;
import com.example.backend.model.User;
import com.example.backend.repository.CommentRepository;
import com.example.backend.repository.TicketRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public CommentService(
            CommentRepository commentRepository,
            TicketRepository ticketRepository,
            UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    public CommentResponse createComment(CommentRequest request, String userEmail) {
        User author = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));
        Ticket ticket = ticketRepository.findById(request.getTicketId())
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found"));

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setTicket(ticket);
        comment.setAuthor(author);

        return mapToResponse(commentRepository.save(comment));
    }

    public CommentResponse getCommentById(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found"));
        return mapToResponse(comment);
    }

    public List<CommentResponse> getCommentsByTicket(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found"));

        return commentRepository.findByTicket(ticket)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private CommentResponse mapToResponse(Comment comment) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setContent(comment.getContent());
        response.setTicketId(comment.getTicket().getId());
        response.setAuthor(toUserResponse(comment.getAuthor()));
        response.setCreatedAt(comment.getCreatedAt());
        return response;
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.isActive()
        );
    }
}