package com.example.backend.service;

import com.example.backend.model.Ticket;
import com.example.backend.model.User;
import com.example.backend.model.enums.TicketStatus;
import com.example.backend.repository.TicketRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;

    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public Ticket createTicket(Ticket ticket) {
        if (ticket.getStatus() == null) {
            ticket.setStatus(TicketStatus.OPEN);
        }

        return ticketRepository.save(ticket);
    }

    public Optional<Ticket> getTicketById(Long id) {
        return ticketRepository.findById(id);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public List<Ticket> getTicketsByRequester(User requester) {
        return ticketRepository.findByRequester(requester);
    }

    public List<Ticket> getTicketsByAssignedStaff(User assignedStaff) {
        return ticketRepository.findByAssignedStaff(assignedStaff);
    }

    public Ticket updateTicket(Ticket ticket) {
        return ticketRepository.save(ticket);
    }

    public void deleteTicket(Long id) {
        ticketRepository.deleteById(id);
    }
}