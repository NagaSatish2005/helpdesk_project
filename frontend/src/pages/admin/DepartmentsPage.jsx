import React, { useMemo, useState } from 'react'
import Alert from '../../components/common/UI/Alert'
import Badge from '../../components/common/UI/Badge'
import Button from '../../components/common/UI/Button'
import Card from '../../components/common/UI/Card'
import Input from '../../components/common/UI/Input'
import Modal from '../../components/common/UI/Modal'
import Pagination from '../../components/common/UI/Pagination'
import Select from '../../components/common/UI/Select'
import styles from './DepartmentsPage.module.css'

const sampleDepartments = [
  {
    id: 'D-001',
    name: 'IT Support',
    description: 'Handles all IT-related support requests and system access issues.',
    head: 'Alicia Gomez',
    contact: 'it-support@example.com',
    status: 'Active',
    staffCount: 14,
    ticketStats: { total: 128, open: 21, resolved: 107, avgResolutionMins: 185 },
  },
  {
    id: 'D-002',
    name: 'Network Team',
    description: 'Manages network infrastructure, connectivity, and security.',
    head: 'Brian Chan',
    contact: 'network@example.com',
    status: 'Active',
    staffCount: 9,
    ticketStats: { total: 76, open: 8, resolved: 68, avgResolutionMins: 210 },
  },
  {
    id: 'D-003',
    name: 'Hardware Support',
    description: 'Maintains and repairs hardware devices across the organization.',
    head: 'Chen Li',
    contact: 'hardware@example.com',
    status: 'Active',
    staffCount: 11,
    ticketStats: { total: 92, open: 16, resolved: 76, avgResolutionMins: 240 },
  },
  {
    id: 'D-004',
    name: 'Software Support',
    description: 'Assists with software installs, licensing, and troubleshooting.',
    head: 'Dana Smith',
    contact: 'software@example.com',
    status: 'Inactive',
    staffCount: 5,
    ticketStats: { total: 40, open: 2, resolved: 38, avgResolutionMins: 170 },
  },
  {
    id: 'D-005',
    name: 'Account Services',
    description: 'Manages user accounts, permissions, and access control.',
    head: 'Emma Wells',
    contact: 'accounts@example.com',
    status: 'Active',
    staffCount: 8,
    ticketStats: { total: 65, open: 7, resolved: 58, avgResolutionMins: 195 },
  },
]

const statuses = ['All', 'Active', 'Inactive'].map((status) => ({ value: status, label: status }))

export default function DepartmentsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [page, setPage] = useState(1)
  const [activeDepartment, setActiveDepartment] = useState(null)
  const [modal, setModal] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const pageSize = 4

  const filteredDepartments = useMemo(() => {
    return sampleDepartments
      .filter((dept) => {
        if (statusFilter !== 'All' && dept.status !== statusFilter) return false
        if (!search) return true
        const lc = search.toLowerCase()
        return (
          dept.name.toLowerCase().includes(lc) ||
          dept.id.toLowerCase().includes(lc) ||
          dept.head.toLowerCase().includes(lc)
        )
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredDepartments.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paged = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return filteredDepartments.slice(start, start + pageSize)
  }, [filteredDepartments, safePage])

  const handleOpenDetails = (dept) => {
    setActiveDepartment(dept)
  }

  const handleCloseDetails = () => {
    setActiveDepartment(null)
  }

  const handleAdd = () => {
    setModal({ title: 'Add department', message: 'Department creation is still a local demo.' })
  }

  const handleEdit = (deptId) => {
    handleCloseDetails()
    setModal({ title: 'Edit department', message: `Editing ${deptId} is still a local demo.` })
  }

  const handleDelete = (deptId) => {
    setModal({ type: 'delete', title: 'Delete department', departmentId: deptId })
  }

  const handleAssignStaff = (deptId) => {
    handleCloseDetails()
    setModal({ title: 'Manage staff', message: `Assigning or reassigning staff for ${deptId} is still a local demo.` })
  }

  const showFeedback = (title, message, type = 'success') => {
    setFeedback({ title, message, type })
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Departments</h1>
          <p>View and manage departments, staff assignments, and performance metrics.</p>
        </div>
        <Button onClick={handleAdd}>Add department</Button>
      </header>

      <section className={styles.filters}>
        <Input
          className={styles.search}
          placeholder="Search by name, ID, or head..."
          value={search}
          aria-label="Search departments by name, ID, or head"
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />

        <Select
          className={styles.filter}
          fullWidth={false}
          label="Status"
          value={statusFilter}
          options={statuses}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
        />

        <div className={styles.stats}>
          Showing {filteredDepartments.length} department{filteredDepartments.length === 1 ? '' : 's'}
        </div>
      </section>

      <div className={styles.list}>
        {paged.length === 0 ? (
          <Card className={styles.emptyState}>No departments found.</Card>
        ) : paged.map((dept) => (
          <Card key={dept.id} className={styles.card} padding="none">
            <div className={styles.row}>
              <div>
                <h2 className={styles.title}>{dept.name}</h2>
                <div className={styles.meta}>
                  <span>{dept.id}</span>
                  <span>•</span>
                  <span>{dept.head}</span>
                  <span>•</span>
                  <span>{dept.staffCount} staff</span>
                </div>
              </div>
              <Badge variant={dept.status === 'Active' ? 'success' : 'danger'}>{dept.status}</Badge>
            </div>

            <p className={styles.description}>{dept.description}</p>

            <div className={styles.metrics}>
              <div>
                <div className={styles.metricLabel}>Tickets</div>
                <div className={styles.metricValue}>{dept.ticketStats.total}</div>
              </div>
              <div>
                <div className={styles.metricLabel}>Open</div>
                <div className={styles.metricValue}>{dept.ticketStats.open}</div>
              </div>
              <div>
                <div className={styles.metricLabel}>Resolved</div>
                <div className={styles.metricValue}>{dept.ticketStats.resolved}</div>
              </div>
              <div>
                <div className={styles.metricLabel}>Avg. resolution</div>
                <div className={styles.metricValue}>{dept.ticketStats.avgResolutionMins}m</div>
              </div>
            </div>

            <div className={styles.actions}>
              <Button size="small" variant="secondary" onClick={() => handleOpenDetails(dept)}>Details</Button>
              <Button size="small" variant="secondary" onClick={() => handleAssignStaff(dept.id)}>Assign staff</Button>
              <Button size="small" variant="secondary" onClick={() => handleEdit(dept.id)}>Edit</Button>
              <Button size="small" variant="danger" onClick={() => handleDelete(dept.id)}>Delete</Button>
            </div>
          </Card>
        ))}
      </div>

      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={filteredDepartments.length}
        onPageChange={setPage}
        className={styles.pagination}
      />

      {feedback ? (
        <Alert type={feedback.type} title={feedback.title} closable onClose={() => setFeedback(null)} className={styles.feedback}>
          {feedback.message}
        </Alert>
      ) : null}

      <Modal isOpen={Boolean(activeDepartment)} onClose={handleCloseDetails} title={activeDepartment ? `${activeDepartment.name} details` : ''} size="large">
        {activeDepartment ? (
          <div className={styles.drawerBody}>
            <div className={styles.drawerRow}>
              <div>
                <strong>Department ID</strong>
                <div>{activeDepartment.id}</div>
              </div>
              <div>
                <strong>Head</strong>
                <div>{activeDepartment.head}</div>
              </div>
              <div>
                <strong>Contact</strong>
                <div>{activeDepartment.contact}</div>
              </div>
            </div>

            <div className={styles.drawerRow}>
              <div>
                <strong>Status</strong>
                <div><Badge variant={activeDepartment.status === 'Active' ? 'success' : 'danger'}>{activeDepartment.status}</Badge></div>
              </div>
              <div>
                <strong>Staff members</strong>
                <div>{activeDepartment.staffCount}</div>
              </div>
            </div>

            <div className={styles.drawerRow}>
              <div style={{ flex: 1 }}>
                <strong>Description</strong>
                <p className={styles.drawerDescription}>{activeDepartment.description}</p>
              </div>
            </div>

            <div className={styles.drawerActions}>
              <Button variant="secondary" onClick={() => handleAssignStaff(activeDepartment.id)}>Manage staff</Button>
              <Button onClick={() => handleEdit(activeDepartment.id)}>Edit department</Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        isOpen={modal?.type === 'delete'}
        onClose={() => setModal(null)}
        title={modal?.title}
        footer={
          <div className={styles.modalActions}>
            <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={() => {
                showFeedback('Department deleted', `Department ${modal.departmentId} deleted (demo).`)
                setModal(null)
              }}
            >
              Delete
            </Button>
          </div>
        }
      >
        <p>Delete department {modal?.departmentId}? This cannot be undone.</p>
      </Modal>

      <Modal isOpen={Boolean(modal && modal.type !== 'delete')} onClose={() => setModal(null)} title={modal?.title}>
        <p>{modal?.message}</p>
      </Modal>
    </div>
  )
}
