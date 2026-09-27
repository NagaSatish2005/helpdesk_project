package com.example.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.model.Attachment;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

    List<Attachment> findByTicketIdOrderByUploadedAtAsc(Long ticketId);

    List<Attachment> findByUploadedById(Long uploadedById);
}