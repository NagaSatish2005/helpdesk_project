import React, { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styles from './TicketDetailPage.module.css'

const sampleTickets = [
  {
    id: 'T-001',
    title: 'Wi-Fi connectivity issues on 2nd floor',
    description: 'Users are unable to connect to Wi-Fi in the north wing of the second floor.',
    category: 'IT',
    priority: 'High',
    status: 'Open',
    created: '2026-03-03',
    updated: '2026-03-07',
    requester: { name: 'Emma Wells', email: 'emma.wells@example.com' },
    assignedTo: { name: 'Alicia Gomez', email: 'alicia.gomez@example.com', department: 'IT Support' },
    attachments: [
      { id: 'a1', name: 'wifi-log.txt', size: '48KB' },
      { id: 'a2', name: 'floor-plan.png', size: '1.2MB' },
    ],
    comments: [
      { id: 'c1', author: 'Alicia Gomez', date: '2026-03-05', message: 'Investigating the access points; looks like a DHCP issue.' },
      { id: 'c2', author: 'Emma Wells', date: '2026-03-06', message: 'Thank you. The connectivity seems to be improving.' },
    ],
    timeline: [
      { id: 't1', date: '2026-03-03', event: 'Ticket created by Emma Wells' },
      { id: 't2', date: '2026-03-05', event: 'Assigned to Alicia Gomez' },
      { id: 't3', date: '2026-03-06', event: 'Work in progress: checking DHCP server' },
    ],
  },
  {
    id: 'T-002',
    title: 'Request for new office chairs',
    description: 'Several chairs on the third floor are broken and need replacement.',
    category: 'Facilities',
    priority: 'Medium',
    status: 'Closed',
    created: '2026-02-18',
    updated: '2026-02-20',
    requester: { name: 'Kamal Jain', email: 'kamal.jain@example.com' },
    assignedTo: { name: 'Brian Chan', email: 'brian.chan@example.com', department: 'Facilities' },
    attachments: [],
    comments: [
      { id: 'c1', author: 'Brian Chan', date: '2026-02-19', message: 'Ordered 10 new chairs; will update when delivered.' },
      { id: 'c2', author: 'Kamal Jain', date: '2026-02-20', message: 'Chairs arrived and are being installed.' },
    ],
    timeline: [
      { id: 't1', date: '2026-02-18', event: 'Ticket created by Kamal Jain' },
      { id: 't2', date: '2026-02-19', event: 'Assigned to Brian Chan' },
      { id: 't3', date: '2026-02-20', event: 'Resolved and closed' },
    ],
  },
]

export default function TicketDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const ticket = useMemo(() => sampleTickets.find((t) => t.id === id) || sampleTickets[0], [id])

  const [status, setStatus] = useState(ticket.status)
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState(ticket.comments)

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
            <button className={styles.primary} onClick={() => alert(`Status set to ${status} (demo).`)}>
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
