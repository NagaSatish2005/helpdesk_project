package com.example.backend.repository;

import com.example.backend.model.Ticket;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByRequester(User requester);

    List<Ticket> findByAssignedStaff(User assignedStaff);
}