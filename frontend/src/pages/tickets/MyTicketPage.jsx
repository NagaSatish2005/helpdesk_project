import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useTickets from '../../hooks/useTickets'
import styles from './MyTicketPage.module.css'

const statusOptions = ['All', 'Open', 'In Progress', 'Closed']
const priorityOptions = ['All', 'High', 'Medium', 'Low']

export default function MyTicketPage() {
  const navigate = useNavigate()
  const { tickets: sourceTickets } = useTickets()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [page, setPage] = useState(1)
  const pageSize = 5

  const tickets = useMemo(() => sourceTickets
    .filter((ticket) => String(ticket.id || '').startsWith('T-'))
    .map((ticket) => ({
      ...ticket,
      title: ticket.title || ticket.subject || 'Untitled ticket',
      updated: ticket.updated || ticket.created || '',
    })), [sourceTickets])

  const filtered = useMemo(() => {
    return tickets
      .filter((ticket) => {
        if (statusFilter !== 'All' && ticket.status !== statusFilter) return false
        if (priorityFilter !== 'All' && ticket.priority !== priorityFilter) return false
        if (!search) return true
        return (
          ticket.title.toLowerCase().includes(search.toLowerCase()) ||
          ticket.id.toLowerCase().includes(search.toLowerCase())
        )
      })
      .sort((a, b) => (a.updated < b.updated ? 1 : -1))
  }, [tickets, search, statusFilter, priorityFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page])

  const handleView = (id) => {
    navigate(`/tickets/${id}`)
  }

  const handleReopen = (ticketId) => {
    alert(`Ticket ${ticketId} has been reopened (demo).`)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>My Tickets</h1>
          <p>Track your tickets, view updates, and take action quickly.</p>
        </div>
        <button className={styles.primary} onClick={() => navigate('/create-ticket')}>
          Create new ticket
        </button>
      </header>

      <section className={styles.filters}>
        <input
          className={styles.search}
          placeholder="Search ticket ID or title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          {priorityOptions.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>

        <div className={styles.notification}>
          <span className={styles.dot} />
          Ticket updates are shown in real time (demo).
        </div>
      </section>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Last updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paged.length === 0 ? (
            <tr>
              <td colSpan={5} className={styles.emptyRow}>
                No tickets found.
              </td>
            </tr>
          ) : (
            paged.map((ticket) => (
              <tr key={ticket.id}>
                <td>
                  <div className={styles.ticketId}>{ticket.id}</div>
                  <div className={styles.ticketTitle}>{ticket.title}</div>
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[ticket.status.replace(/\s+/g, '')]}`}>
                    {ticket.status}
                  </span>
                </td>
                <td>
                  <span className={`${styles.priorityBadge} ${styles[ticket.priority]}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td>{ticket.updated}</td>
                <td className={styles.actions}>
                  <button className={styles.secondary} onClick={() => handleView(ticket.id)}>
                    View
                  </button>
                  <button className={styles.secondary} onClick={() => alert('Comment dialog (demo).')}>
                    Comment
                  </button>
                  {ticket.status === 'Closed' && (
                    <button className={styles.primary} onClick={() => handleReopen(ticket.id)}>
                      Reopen
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className={styles.secondary}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className={styles.secondary}
        >
          Next
        </button>
      </div>
    </div>
  )
}
