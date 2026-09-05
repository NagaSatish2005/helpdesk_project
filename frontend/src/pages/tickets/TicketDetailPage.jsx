import React, { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useTickets from '../../hooks/useTickets'
import styles from './TicketDetailPage.module.css'

export default function TicketDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { tickets, updateTicket } = useTickets()
  const ticket = useMemo(() => {
    const selectedTicket = tickets.find((candidate) => candidate.id === id)
    if (!selectedTicket) return null

    return {
      ...selectedTicket,
      title: selectedTicket.title || selectedTicket.subject || `Ticket ${selectedTicket.id}`,
      requester: selectedTicket.requester || { name: 'Not provided', email: 'Not provided' },
      assignedTo: selectedTicket.assignedTo || { name: 'Unassigned', email: 'Not provided', department: 'Not assigned' },
      attachments: selectedTicket.attachments || [],
      comments: selectedTicket.comments || [],
      timeline: selectedTicket.timeline || [],
    }
  }, [tickets, id])

  const [status, setStatus] = useState(ticket.status)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState(ticket?.comments || [])

  const addComment = () => {
    if (!commentText.trim()) return
    setComments((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        author: 'You',
        date: new Date().toISOString().slice(0, 10),
        message: commentText.trim(),
      },
    ])
    setCommentText('')
  }

  const applyStatus = () => {
    updateTicket(ticket.id, { status })
    alert(`Status set to ${status} (demo).`)
  }

  if (!ticket) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1>Ticket not found</h1>
            <p className={styles.subtitle}>No ticket exists for ID: {id}</p>
          </div>
          <button className={styles.secondary} onClick={() => navigate('/my-tickets')}>
            Back to my tickets
          </button>
        </header>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>{ticket.title}</h1>
          <p className={styles.subtitle}>Ticket ID: {ticket.id}</p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.secondary} onClick={() => navigate(-1)}>
            Back to list
          </button>
          <button className={styles.primary} onClick={() => alert('Edit ticket (demo).')}>
            Edit ticket
          </button>
        </div>
      </header>

      <section className={styles.row}>
        <div className={styles.card}>
          <h2>Ticket information</h2>
          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Category</span>
              <span className={styles.fieldValue}>{ticket.category}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Priority</span>
              <span className={styles.fieldValue}>{ticket.priority}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Status</span>
              <span className={styles.fieldValue}>{status}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Created</span>
              <span className={styles.fieldValue}>{ticket.created}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Last updated</span>
              <span className={styles.fieldValue}>{ticket.updated}</span>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Description</span>
              <p className={styles.fieldDescription}>{ticket.description}</p>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2>Ticket status controls</h2>
          <div className={styles.statusControls}>
            <label>
              <span className={styles.fieldLabel}>Update status</span>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
                <option>Closed</option>
              </select>
            </label>
            <button className={styles.primary} onClick={applyStatus}>
              Apply
            </button>
          </div>

          <h3>User details</h3>
          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Name</span>
              <span className={styles.fieldValue}>{ticket.requester.name}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Email</span>
              <span className={styles.fieldValue}>{ticket.requester.email}</span>
            </div>
          </div>

          <h3>Assigned staff</h3>
          <div className={styles.fieldGroup}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Name</span>
              <span className={styles.fieldValue}>{ticket.assignedTo.name}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Email</span>
              <span className={styles.fieldValue}>{ticket.assignedTo.email}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Department</span>
              <span className={styles.fieldValue}>{ticket.assignedTo.department}</span>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.row}>
        <div className={styles.card}>
          <h2>Comments &amp; conversation</h2>
          <div className={styles.comments}>
            {comments.map((comment) => (
              <div key={comment.id} className={styles.comment}>
                <div className={styles.commentHeader}>
                  <span className={styles.commentAuthor}>{comment.author}</span>
                  <span className={styles.commentDate}>{comment.date}</span>
                </div>
                <p className={styles.commentBody}>{comment.message}</p>
              </div>
            ))}
          </div>

          <div className={styles.newComment}>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
            />
            <button className={styles.primary} onClick={addComment}>
              Post comment
            </button>
          </div>
        </div>

        <div className={styles.card}>
          <h2>Attachments</h2>
          {ticket.attachments.length === 0 ? (
            <p className={styles.empty}>No attachments uploaded.</p>
          ) : (
            <ul className={styles.attachments}>
              {ticket.attachments.map((file) => (
                <li key={file.id} className={styles.attachmentItem}>
                  <span>{file.name}</span>
                  <span className={styles.attachmentSize}>{file.size}</span>
                </li>
              ))}
            </ul>
          )}
          <button
            className={styles.secondary}
            onClick={() => alert('Upload functionality not implemented (demo).')}
          >
            Upload attachment
          </button>
        </div>
      </section>

      <section className={styles.card}>
        <h2>Activity timeline</h2>
        <ol className={styles.timeline}>
          {ticket.timeline.map((entry) => (
            <li key={entry.id}>
              <span className={styles.timelineDate}>{entry.date}</span>
              <span className={styles.timelineEvent}>{entry.event}</span>
            </li>
          ))}
        </ol>

        <div className={styles.actionRow}>
          <button className={styles.secondary} onClick={() => alert('Print ticket (demo).')}>
            Print
          </button>
          <button className={styles.primary} onClick={() => alert('Export to PDF (demo).')}>
            Export PDF
          </button>
        </div>
      </section>
    </div>
  )
}
