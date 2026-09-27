package com.example.backend.service;

import com.example.backend.dto.request.TicketRequest;
import com.example.backend.dto.request.TicketUpdateRequest;
import com.example.backend.dto.response.TicketResponse;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.model.Ticket;
import com.example.backend.model.User;
import com.example.backend.model.enums.TicketStatus;
import com.example.backend.model.enums.TicketCategory;
import com.example.backend.model.Department;
import com.example.backend.repository.DepartmentRepository;
import com.example.backend.repository.TicketRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;
import java.util.EnumMap;
import java.util.Comparator;
import java.util.stream.Collectors;

@Service
public class TicketService {

    private static final Logger logger = LoggerFactory.getLogger(TicketService.class);

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;

    private static final Map<TicketCategory, String> CATEGORY_DEPARTMENTS = createCategoryDepartmentMap();
    private static final List<TicketStatus> ACTIVE_TICKET_STATUSES = List.of(
            TicketStatus.OPEN,
            TicketStatus.IN_PROGRESS);

    public TicketService(
            TicketRepository ticketRepository,
            UserRepository userRepository,
            DepartmentRepository departmentRepository) {
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
    }

    @Transactional
    public TicketResponse createTicket(TicketRequest request, String userEmail) {
        User creator = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated user not found"));

        Ticket ticket = new Ticket();
        ticket.setTitle(request.getTitle());
        ticket.setDescription(request.getDescription());
        ticket.setPriority(request.getPriority());
        ticket.setCategory(request.getCategory());
        ticket.setStatus(TicketStatus.OPEN);
        ticket.setRequester(creator);
        ticket.setAssignedTo(findAvailableStaff(request.getCategory()));

        return mapToResponse(ticketRepository.save(ticket));
    }

    @Transactional(readOnly = true)
    public TicketResponse getTicketById(Long id, Authentication authentication) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found"));

        User authenticatedUser = getAuthenticatedUser(authentication);
        if (!hasAuthority(authentication, "ROLE_ADMIN")
                && !isTicketAccessible(ticket, authenticatedUser, authentication)) {
            throw new AccessDeniedException("You are not authorized to view this ticket.");
        }

        return mapToResponse(ticket);
    }

    public TicketResponse updateTicket(Long id, TicketUpdateRequest request) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found"));

        if (request.getStatus() != null) {
            ticket.setStatus(request.getStatus());
        }
        if (request.getPriority() != null) {
            ticket.setPriority(request.getPriority());
        }
        if (request.getCategory() != null) {
            ticket.setCategory(request.getCategory());
        }
        if (request.isAssignedToIdProvided()) {
            User assignedTo = request.getAssignedToId() == null
                    ? null
                    : userRepository.findById(request.getAssignedToId())
                            .orElseThrow(() -> new IllegalArgumentException("Assigned user not found"));
            if (assignedTo != null && assignedTo.getRole() != com.example.backend.model.enums.UserRole.STAFF) {
                throw new IllegalArgumentException("Tickets can only be assigned to Staff users");
            }
            if (assignedTo != null && !belongsToCategoryDepartment(assignedTo, ticket.getCategory())) {
                throw new IllegalArgumentException("Assigned Staff must belong to the ticket category department");
            }
            ticket.setAssignedTo(assignedTo);
        }

        return mapToResponse(ticketRepository.save(ticket));
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> getAllTickets() {
        return ticketRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> getTicketsForAuthenticatedUser(Authentication authentication) {
        if (hasAuthority(authentication, "ROLE_ADMIN")) {
            return getAllTickets();
        }

        User authenticatedUser = getAuthenticatedUser(authentication);
        if (hasAuthority(authentication, "ROLE_STAFF")) {
            return ticketRepository.findByAssignedToId(authenticatedUser.getId())
                    .stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        }

        return getTicketsByUser(authenticatedUser.getId());
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> getTicketsByUser(Long userId) {
        return ticketRepository.findByRequesterId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<TicketResponse> getTicketsByUser(
            Long requestedUserId,
            Authentication authentication) {
        if (hasAuthority(authentication, "ROLE_STAFF")) {
            User authenticatedUser = getAuthenticatedUser(authentication);
            return ticketRepository.findByAssignedToId(authenticatedUser.getId())
                    .stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        }

        Long userId = requestedUserId;
        if (hasAuthority(authentication, "ROLE_STUDENT")) {
            userId = getAuthenticatedUser(authentication).getId();
        }

        return getTicketsByUser(userId);
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new AccessDeniedException("Authenticated user not found.");
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new AccessDeniedException("Authenticated user not found."));
    }

    private boolean isTicketAccessible(
            Ticket ticket,
            User authenticatedUser,
            Authentication authentication) {
        if (hasAuthority(authentication, "ROLE_STAFF")) {
            return ticket.getAssignedTo() != null
                    && authenticatedUser.getId().equals(ticket.getAssignedTo().getId());
        }

        return hasAuthority(authentication, "ROLE_STUDENT")
                && authenticatedUser.getId().equals(ticket.getRequester().getId());
    }

    private boolean hasAuthority(Authentication authentication, String authority) {
        return authentication != null
                && authentication.getAuthorities().stream()
                        .anyMatch(grantedAuthority -> authority.equals(grantedAuthority.getAuthority()));
    }

    private TicketResponse mapToResponse(Ticket ticket) {
        TicketResponse response = new TicketResponse();
        response.setId(ticket.getId());
        response.setTitle(ticket.getTitle());
        response.setDescription(ticket.getDescription());
        response.setStatus(ticket.getStatus());
        response.setPriority(ticket.getPriority());
        response.setCategory(ticket.getCategory());
        response.setCreator(toUserResponse(ticket.getRequester()));
        response.setAssignedTo(toUserResponse(ticket.getAssignedTo()));
        response.setAssignedDepartment(ticket.getAssignedTo() == null
            ? null
            : toDepartmentSummary(ticket.getAssignedTo().getDepartment()));
        response.setCreatedAt(ticket.getCreatedAt());
        response.setUpdatedAt(ticket.getUpdatedAt());
        return response;
    }

    private UserResponse toUserResponse(User user) {
        if (user == null) {
            return null;
        }

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
            user.isActive(),
            user.getDepartment() == null ? null : user.getDepartment().getId(),
            user.getDepartment() == null ? null : user.getDepartment().getName()
        );
    }

        private User findAvailableStaff(TicketCategory category) {
        String departmentName = CATEGORY_DEPARTMENTS.get(category);
        Department department = findDepartmentForCategory(departmentName);
        logger.info("Ticket category {} -> resolved department {}", category,
                department == null ? "none" : department.getName());
        if (department == null || !department.isActive()) {
            logger.info("Ticket category {} -> no active department available", category);
            return null;
        }

        List<User> eligibleStaff = userRepository.findByDepartmentIdAndRoleAndActiveTrue(
                department.getId(), com.example.backend.model.enums.UserRole.STAFF);
        logger.info("Department {} -> eligible active staff count {}", department.getName(), eligibleStaff.size());

        User selectedStaff = null;
        long selectedCount = Long.MAX_VALUE;
        for (User staff : eligibleStaff) {
            long activeTicketCount = ticketRepository.countByAssignedToIdAndStatusIn(
                    staff.getId(), ACTIVE_TICKET_STATUSES);
            logger.info("Staff id {} -> active ticket count {}", staff.getId(), activeTicketCount);
            if (selectedStaff == null
                    || activeTicketCount < selectedCount
                    || (activeTicketCount == selectedCount && staff.getId() < selectedStaff.getId())) {
                selectedStaff = staff;
                selectedCount = activeTicketCount;
            }
        }

        logger.info("Selected staff id {} -> assignedTo id {}", selectedStaff == null ? null : selectedStaff.getId(),
                selectedStaff == null ? null : selectedStaff.getId());
        return selectedStaff;
    }

    private boolean belongsToCategoryDepartment(User staff, TicketCategory category) {
        Department department = findDepartmentForCategory(CATEGORY_DEPARTMENTS.get(category));
        return department != null
                && staff.getDepartment() != null
                && department.getId().equals(staff.getDepartment().getId());
    }

    private Department findDepartmentForCategory(String categoryName) {
        if (categoryName == null) return null;

        String normalizedCategory = normalizeDepartmentName(categoryName);
        return departmentRepository.findAll().stream()
                .filter(department -> normalizeDepartmentName(department.getName()).equals(normalizedCategory))
                .findFirst()
                .orElse(null);
    }

    private String normalizeDepartmentName(String name) {
        return name == null
                ? ""
                : name.toLowerCase()
                        .replaceAll("\\b(department|support|team)\\b", "")
                        .replaceAll("[^a-z0-9]", "");
    }

    private static Map<TicketCategory, String> createCategoryDepartmentMap() {
        Map<TicketCategory, String> mapping = new EnumMap<>(TicketCategory.class);
        mapping.put(TicketCategory.HOSTEL, "Hostel");
        mapping.put(TicketCategory.TRANSPORT, "Transport");
        mapping.put(TicketCategory.FEES, "Fees");
        mapping.put(TicketCategory.IT, "IT");
        mapping.put(TicketCategory.FACILITIES, "Facilities");
        mapping.put(TicketCategory.NETWORK, "Network");
        mapping.put(TicketCategory.HARDWARE, "Hardware");
        mapping.put(TicketCategory.SOFTWARE, "Software");
        return mapping;
        }

        private com.example.backend.dto.response.DepartmentSummaryResponse toDepartmentSummary(Department department) {
        if (department == null) return null;
        return new com.example.backend.dto.response.DepartmentSummaryResponse(
            department.getId(), department.getName());
        }
}