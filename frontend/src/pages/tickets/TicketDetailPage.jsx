import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { categories } from '../../assets/data/categories'
import useAuth from '../../hooks/useAuth'
import useTickets from '../../hooks/useTickets'
import api from '../../services/api'
import styles from './TicketDetailPage.module.css'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const statusLabels = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
}

const categoryValues = {
  Hostel: 'HOSTEL',
  Transport: 'TRANSPORT',
  Fees: 'FEES',
  It: 'IT',
  IT: 'IT',
  Facilities: 'FACILITIES',
  Software: 'SOFTWARE',
  Hardware: 'HARDWARE',
  Network: 'NETWORK',
  Finance: 'FINANCE',
  HR: 'HR',
}

const categoryOptions = categories.reduce((options, category) => {
  const value = categoryValues[category.name]
  if (value && !options.some((option) => option.value === value)) {
    options.push({ label: category.name, value })
  }
  return options
}, [])

const statusOptions = ['Open', 'In Progress', 'Resolved', 'Closed']
const priorityOptions = ['HIGH', 'MEDIUM', 'LOW']

function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback
}

function mapComment(comment) {
  return {
    id: comment.id,
    author: comment.author?.name || 'Unknown',
    date: comment.createdAt,
    message: comment.content,
  }
}

export default function TicketDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { tickets, updateTicket } = useTickets()
  const canManageTicket = ['STAFF', 'ADMIN'].includes(String(user?.role || '').toUpperCase())
  const contextTicket = useMemo(() => tickets.find((candidate) => String(candidate.id) === String(id)) || null, [tickets, id])
  const [fetchedTicket, setFetchedTicket] = useState(null)
  const [ticketLoading, setTicketLoading] = useState(false)
  const [ticketError, setTicketError] = useState('')
  const [status, setStatus] = useState('')
  const [commentText, setCommentText] = useState('')
  const [comments, setComments] = useState([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentsError, setCommentsError] = useState('')
  const [commentSubmitting, setCommentSubmitting] = useState(false)
  const [statusUpdating, setStatusUpdating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({ status: '', priority: '', category: '', assignedToId: '' })
  const [staffUsers, setStaffUsers] = useState([])
  const [staffLoading, setStaffLoading] = useState(false)
  const [staffError, setStaffError] = useState('')
  const [editSaving, setEditSaving] = useState(false)
  const [editError, setEditError] = useState('')
  const [pdfGenerating, setPdfGenerating] = useState(false)
  const [pdfError, setPdfError] = useState('')
  const ticketDetailsRef = useRef(null)

  useEffect(() => {
    if (contextTicket || !id || !Number.isFinite(Number(id))) {
      setFetchedTicket(null)
      setTicketError('')
      return undefined
    }

    let isMounted = true
    setTicketLoading(true)
    setTicketError('')

    api.get(`/api/tickets/${id}`)
      .then((response) => {
        if (isMounted) setFetchedTicket(response.data?.data || null)
      })
      .catch((error) => {
        if (isMounted) setTicketError(getErrorMessage(error, 'Unable to load ticket.'))
      })
      .finally(() => {
        if (isMounted) setTicketLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [contextTicket, id])

  const ticket = useMemo(() => {
    const selectedTicket = contextTicket || fetchedTicket
    if (!selectedTicket) return null

    return {
      ...selectedTicket,
      title: selectedTicket.title || selectedTicket.subject || `Ticket ${selectedTicket.id}`,
      status: statusLabels[selectedTicket.status] || selectedTicket.status,
      created: selectedTicket.createdAt || selectedTicket.created || '',
      updated: selectedTicket.updatedAt || selectedTicket.updated || '',
      requester: selectedTicket.creator || { name: 'Not provided', email: 'Not provided' },
      assignedTo: selectedTicket.assignedTo
        ? { ...selectedTicket.assignedTo, department: selectedTicket.assignedTo.department || '' }
        : { name: 'Unassigned', email: 'Not provided', department: 'Not assigned' },
      attachments: selectedTicket.attachments || [],
      timeline: selectedTicket.timeline || [],
    }
  }, [contextTicket, fetchedTicket])

  useEffect(() => {
    setStatus(ticket?.status || '')
  }, [ticket])

  useEffect(() => {
    if (!canManageTicket) return undefined

    let isMounted = true
    setStaffLoading(true)
    setStaffError('')

    api.get('/api/users')
      .then((response) => {
        if (!isMounted) return
        const users = Array.isArray(response.data?.data) ? response.data.data : []
        setStaffUsers(users.filter((staffUser) => String(staffUser.role || '').toUpperCase() === 'STAFF'))
      })
      .catch((error) => {
        if (isMounted) setStaffError(getErrorMessage(error, 'Unable to load staff users.'))
      })
      .finally(() => {
        if (isMounted) setStaffLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [canManageTicket])

  useEffect(() => {
    if (!ticket) {
      setComments([])
      return undefined
    }

    let isMounted = true
    setCommentsLoading(true)
    setCommentsError('')
    setComments([])

    api.get(`/api/comments/ticket/${ticket.id}`)
      .then((response) => {
        if (isMounted) setComments(Array.isArray(response.data?.data) ? response.data.data.map(mapComment) : [])
      })
      .catch((error) => {
        if (isMounted) setCommentsError(getErrorMessage(error, 'Unable to load comments.'))
      })
      .finally(() => {
        if (isMounted) setCommentsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [ticket])

  const addComment = async () => {
    const content = commentText.trim()
    if (!content || commentSubmitting || !ticket) return

    setCommentSubmitting(true)
    setCommentsError('')
    try {
      const response = await api.post('/api/comments', {
        ticketId: Number(id),
        content,
      })
      setComments((prev) => [...prev, mapComment(response.data?.data)])
      setCommentText('')
    } catch (error) {
      setCommentsError(getErrorMessage(error, 'Unable to post comment.'))
    } finally {
      setCommentSubmitting(false)
    }
  }

  const applyStatus = async () => {
    if (statusUpdating || !ticket) return

    setStatusUpdating(true)
    setTicketError('')
    try {
      const updatedTicket = await updateTicket(ticket.id, { status })
      if (fetchedTicket) setFetchedTicket(updatedTicket)
      alert('Status updated successfully.')
    } catch (error) {
      setTicketError(getErrorMessage(error, 'Unable to update status.'))
    } finally {
      setStatusUpdating(false)
    }
  }

  const getEditValues = (currentTicket) => ({
    status: currentTicket.status || '',
    priority: String(currentTicket.priority || '').toUpperCase(),
    category: String(currentTicket.category || '').toUpperCase(),
    assignedToId: currentTicket.assignedTo?.id ? String(currentTicket.assignedTo.id) : '',
  })

  const startEditing = () => {
    setEditForm(getEditValues(ticket))
    setEditError('')
    setIsEditing(true)
  }

  const cancelEditing = () => {
    setEditForm(getEditValues(ticket))
    setEditError('')
    setIsEditing(false)
  }

  const saveEdit = async () => {
    if (editSaving || !ticket) return

    const currentValues = getEditValues(ticket)
    const updates = {}
    if (editForm.status !== currentValues.status) updates.status = editForm.status
    if (editForm.priority !== currentValues.priority) updates.priority = editForm.priority
    if (editForm.category !== currentValues.category) updates.category = editForm.category
    if (editForm.assignedToId !== currentValues.assignedToId) {
      updates.assignedToId = editForm.assignedToId ? Number(editForm.assignedToId) : null
    }

    setEditSaving(true)
    setEditError('')
    try {
      const updatedTicket = await updateTicket(ticket.id, updates)
      if (fetchedTicket) setFetchedTicket(updatedTicket)
      setIsEditing(false)
      alert('Ticket updated successfully.')
    } catch (error) {
      setEditError(getErrorMessage(error, 'Unable to update ticket.'))
    } finally {
      setEditSaving(false)
    }
  }

  const exportPdf = async () => {
    if (pdfGenerating || !ticketDetailsRef.current) return

    setPdfGenerating(true)
    setPdfError('')
    const source = ticketDetailsRef.current
    const exportWrapper = document.createElement('div')
    const exportNode = source.cloneNode(true)
    exportWrapper.style.position = 'absolute'
    exportWrapper.style.left = '-100000px'
    exportWrapper.style.top = '0'
    exportWrapper.style.width = `${source.offsetWidth}px`
    exportWrapper.style.background = '#fff'
    exportNode.style.width = `${source.offsetWidth}px`
    exportNode.querySelectorAll('[data-pdf-exclude], button').forEach((element) => element.remove())
    exportWrapper.appendChild(exportNode)
    document.body.appendChild(exportWrapper)

    try {
      const canvas = await html2canvas(exportNode, { scale: 2, useCORS: true })
      const pdf = new jsPDF('p', 'mm', 'a4')
      const margin = 10
      const pageWidth = 210 - margin * 2
      const pageHeight = 297 - margin * 2
      const imageHeight = canvas.height * pageWidth / canvas.width
      let remainingHeight = imageHeight
      let position = margin

      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margin, position, pageWidth, imageHeight)
      remainingHeight -= pageHeight

      while (remainingHeight > 0) {
        position = margin - (imageHeight - remainingHeight)
        pdf.addPage()
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', margin, position, pageWidth, imageHeight)
        remainingHeight -= pageHeight
      }

      pdf.save(`ticket-${ticket.id}.pdf`)
    } catch (error) {
      setPdfError(getErrorMessage(error, 'Unable to generate the ticket PDF.'))
    } finally {
      exportWrapper.remove()
      setPdfGenerating(false)
    }
  }

  if (!ticket) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1>{ticketLoading ? 'Loading ticket...' : 'Ticket not found'}</h1>
            <p className={styles.subtitle}>{ticketLoading ? 'Loading ticket details.' : ticketError || `No ticket exists for ID: ${id}`}</p>
          </div>
          <button className={styles.secondary} onClick={() => navigate('/my-tickets')}>
            Back to my tickets
          </button>
        </header>
      </div>
    )
  }

  return (
    <div className={styles.container} ref={ticketDetailsRef}>
      <header className={styles.header}>
        <div>
          <h1>{ticket.title}</h1>
          <p className={styles.subtitle}>Ticket ID: {ticket.id}</p>
        </div>
        <div className={styles.headerActions} data-pdf-exclude="true">
          <button className={styles.secondary} onClick={() => navigate(-1)}>
            Back to list
          </button>
          {canManageTicket ? (
            <button className={styles.primary} onClick={startEditing} disabled={editSaving}>
              Edit ticket
            </button>
          ) : null}
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

          {isEditing ? (
            <div className={styles.fieldGroup} data-pdf-exclude="true">
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Status</span>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm((current) => ({ ...current, status: e.target.value }))}
                  disabled={editSaving}
                >
                  {statusOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Priority</span>
                <select
                  value={editForm.priority}
                  onChange={(e) => setEditForm((current) => ({ ...current, priority: e.target.value }))}
                  disabled={editSaving}
                >
                  {priorityOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Category</span>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm((current) => ({ ...current, category: e.target.value }))}
                  disabled={editSaving}
                >
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <span className={styles.fieldLabel}>Assigned staff</span>
                <select
                  value={editForm.assignedToId}
                  onChange={(e) => setEditForm((current) => ({ ...current, assignedToId: e.target.value }))}
                  disabled={editSaving || staffLoading}
                >
                  <option value="">Unassigned</option>
                  {staffUsers.map((staffUser) => (
                    <option key={staffUser.id} value={staffUser.id}>
                      {staffUser.name || staffUser.email}
                    </option>
                  ))}
                </select>
                {staffError ? <p role="alert">{staffError}</p> : null}
              </div>
              {editError ? <p role="alert">{editError}</p> : null}
              <div className={styles.actionRow}>
                <button className={styles.primary} onClick={saveEdit} disabled={editSaving}>
                  {editSaving ? 'Saving...' : 'Save'}
                </button>
                <button className={styles.secondary} onClick={cancelEditing} disabled={editSaving}>
                  Cancel
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className={styles.card}>
      {canManageTicket ? (
        <>
          <h2>Ticket status controls</h2>
          <div className={styles.statusControls} data-pdf-exclude="true">
            <label>
              <span className={styles.fieldLabel}>Update status</span>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
                <option>Closed</option>
              </select>
              </label>
              <button className={styles.primary} onClick={applyStatus} disabled={statusUpdating}>
                Apply
              </button>
            </div>
        </>
      ) : null}

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
            {commentsLoading ? (
              <p className={styles.empty}>Loading comments...</p>
            ) : commentsError ? (
              <p className={styles.empty}>{commentsError}</p>
            ) : comments.map((comment) => (
              <div key={comment.id} className={styles.comment}>
                <div className={styles.commentHeader}>
                  <span className={styles.commentAuthor}>{comment.author}</span>
                  <span className={styles.commentDate}>{comment.date}</span>
                </div>
                <p className={styles.commentBody}>{comment.message}</p>
                </div>
            ))}
          </div>

          <div className={styles.newComment} data-pdf-exclude="true">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
            />
            <button className={styles.primary} onClick={addComment} disabled={commentSubmitting}>
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

          <div className={styles.actionRow} data-pdf-exclude="true">
            <button className={styles.secondary} onClick={() => window.print()}>
            Print
          </button>
            <button className={styles.primary} onClick={exportPdf} disabled={pdfGenerating}>
              {pdfGenerating ? 'Generating PDF...' : 'Export PDF'}
          </button>
        </div>
          {pdfError ? <p role="alert" data-pdf-exclude="true">{pdfError}</p> : null}
      </section>
    </div>
  )
}
