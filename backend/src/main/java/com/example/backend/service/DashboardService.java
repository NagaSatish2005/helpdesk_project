package com.example.backend.service;

import com.example.backend.model.enums.TicketStatus;
import com.example.backend.repository.TicketRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;

    public DashboardService(
            UserRepository userRepository,
            TicketRepository ticketRepository
    ) {
        this.userRepository = userRepository;
        this.ticketRepository = ticketRepository;
    }

    public long getTotalUsers() {
        return userRepository.count();
    }

    public long getTotalTickets() {
        return ticketRepository.count();
    }

    public long getOpenTickets() {
        return ticketRepository.findAll()
                .stream()
                .filter(ticket -> ticket.getStatus() == TicketStatus.OPEN)
                .count();
    }

    public long getInProgressTickets() {
        return ticketRepository.findAll()
                .stream()
                .filter(ticket -> ticket.getStatus() == TicketStatus.IN_PROGRESS)
                .count();
    }

    public long getResolvedTickets() {
        return ticketRepository.findAll()
                .stream()
                .filter(ticket -> ticket.getStatus() == TicketStatus.RESOLVED)
                .count();
    }

    public long getClosedTickets() {
        return ticketRepository.findAll()
                .stream()
                .filter(ticket -> ticket.getStatus() == TicketStatus.CLOSED)
                .count();
    }
}