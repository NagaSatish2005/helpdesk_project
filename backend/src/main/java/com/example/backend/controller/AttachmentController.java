package com.example.backend.controller;

import java.util.List;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.support.MissingServletRequestPartException;

import com.example.backend.dto.response.ApiResponse;
import com.example.backend.dto.response.AttachmentResponse;
import com.example.backend.model.Attachment;
import com.example.backend.service.AttachmentService;

@RestController
@RequestMapping("/api")
public class AttachmentController {

    private final AttachmentService attachmentService;

    public AttachmentController(AttachmentService attachmentService) {
        this.attachmentService = attachmentService;
    }

    @PostMapping(value = "/tickets/{ticketId}/attachments", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<AttachmentResponse>> uploadAttachment(
            @PathVariable Long ticketId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            AttachmentResponse response = attachmentService.uploadAttachment(
                    ticketId,
                    file,
                    authentication.getName()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(new ApiResponse<>(
                    true,
                    "Attachment uploaded successfully",
                    response
            ));
        } catch (IllegalArgumentException exception) {
            return errorResponse(exception);
        }
    }

    @GetMapping("/tickets/{ticketId}/attachments")
    public ResponseEntity<ApiResponse<List<AttachmentResponse>>> getAttachments(
            @PathVariable Long ticketId) {
        try {
            return ResponseEntity.ok(new ApiResponse<>(
                    true,
                    "Attachments retrieved successfully",
                    attachmentService.getAttachments(ticketId)
            ));
        } catch (IllegalArgumentException exception) {
            return errorResponse(exception);
        }
    }

    @GetMapping("/attachments/{attachmentId}/download")
    public ResponseEntity<ByteArrayResource> downloadAttachment(@PathVariable Long attachmentId) {
        Attachment attachment = attachmentService.getAttachment(attachmentId);
        MediaType contentType;
        try {
            contentType = MediaType.parseMediaType(attachment.getContentType());
        } catch (IllegalArgumentException exception) {
            contentType = MediaType.APPLICATION_OCTET_STREAM;
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(contentType);
        headers.setContentLength(attachment.getFileSize());
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename(attachment.getFileName())
                .build());

        return ResponseEntity.ok()
                .headers(headers)
                .body(new ByteArrayResource(attachment.getData()));
    }

    @DeleteMapping("/attachments/{attachmentId}")
    public ResponseEntity<ApiResponse<Void>> deleteAttachment(
            @PathVariable Long attachmentId,
            Authentication authentication) {
        try {
            attachmentService.deleteAttachment(attachmentId, authentication.getName());
            return ResponseEntity.ok(new ApiResponse<>(
                    true,
                    "Attachment deleted successfully",
                    null
            ));
        } catch (IllegalArgumentException exception) {
            return errorResponse(exception);
        }
    }

    @ExceptionHandler(MissingServletRequestPartException.class)
    public ResponseEntity<ApiResponse<Void>> handleMissingFile() {
        return ResponseEntity.badRequest().body(new ApiResponse<>(
                false,
                "Attachment file is required",
                null
        ));
    }

    private <T> ResponseEntity<ApiResponse<T>> errorResponse(IllegalArgumentException exception) {
        String message = exception.getMessage();
        HttpStatus status = "Ticket not found".equals(message) || "Attachment not found".equals(message)
                || "Authenticated user not found".equals(message)
                ? HttpStatus.NOT_FOUND
                : "You are not allowed to delete this attachment".equals(message)
                ? HttpStatus.FORBIDDEN
                : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(new ApiResponse<>(false, message, null));
    }
}