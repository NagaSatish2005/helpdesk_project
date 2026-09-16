package com.example.backend.repository;

import com.example.backend.model.Ticket;
import com.example.backend.model.User;
import com.example.backend.model.enums.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByRequesterId(Long requesterId);

    List<Ticket> findByAssignedToId(Long assignedToId);

    List<Ticket> findByStatus(TicketStatus status);

    List<Ticket> findByRequester(User requester);

    List<Ticket> findByAssignedTo(User assignedTo);

    default List<Ticket> findByAssignedStaff(User assignedStaff) {
        return findByAssignedTo(assignedStaff);
    }
}