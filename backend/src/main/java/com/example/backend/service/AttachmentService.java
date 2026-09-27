package com.example.backend.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.dto.response.AttachmentResponse;
import com.example.backend.model.Attachment;
import com.example.backend.model.Ticket;
import com.example.backend.model.User;
import com.example.backend.repository.AttachmentRepository;
import com.example.backend.repository.TicketRepository;
import com.example.backend.repository.UserRepository;

@Service
public class AttachmentService {

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024;

    private final AttachmentRepository attachmentRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public AttachmentService(
            AttachmentRepository attachmentRepository,
            TicketRepository ticketRepository,
            UserRepository userRepository) {
        this.attachmentRepository = attachmentRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    public AttachmentResponse uploadAttachment(Long ticketId, MultipartFile file, String userEmail) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found"));
        User uploader = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Attachment file is required and cannot be empty");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("Attachment must not exceed 10 MB");
        }

        try {
            Attachment attachment = new Attachment();
            attachment.setFileName(file.getOriginalFilename() == null
                    ? "attachment"
                    : file.getOriginalFilename());
            attachment.setContentType(file.getContentType() == null
                    ? "application/octet-stream"
                    : file.getContentType());
            attachment.setFileSize(file.getSize());
            attachment.setData(file.getBytes());
            attachment.setUploadedAt(LocalDateTime.now());
            attachment.setTicket(ticket);
            attachment.setUploadedBy(uploader);

            return toResponse(attachmentRepository.save(attachment));
        } catch (IOException exception) {
            throw new IllegalArgumentException("Unable to read attachment file");
        }
    }

    public List<AttachmentResponse> getAttachments(Long ticketId) {
        if (!ticketRepository.existsById(ticketId)) {
            throw new IllegalArgumentException("Ticket not found");
        }

        return attachmentRepository.findByTicketIdOrderByUploadedAtAsc(ticketId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public Attachment getAttachment(Long attachmentId) {
        return attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new IllegalArgumentException("Attachment not found"));
    }

    public void deleteAttachment(Long attachmentId, String userEmail) {
        Attachment attachment = getAttachment(attachmentId);
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));

        boolean isStaffOrAdmin = user.getRole().name().equals("STAFF")
                || user.getRole().name().equals("ADMIN");
        boolean isUploader = attachment.getUploadedBy().getId().equals(user.getId());
        if (!isStaffOrAdmin && !isUploader) {
            throw new IllegalArgumentException("You are not allowed to delete this attachment");
        }

        attachmentRepository.delete(attachment);
    }

    private AttachmentResponse toResponse(Attachment attachment) {
        return new AttachmentResponse(
                attachment.getId(),
                attachment.getFileName(),
                attachment.getContentType(),
                attachment.getFileSize(),
                attachment.getUploadedAt()
        );
    }
}