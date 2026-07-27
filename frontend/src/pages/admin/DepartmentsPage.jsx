import React, { useMemo, useState } from 'react'
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

const statuses = ['All', 'Active', 'Inactive']

export default function DepartmentsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [page, setPage] = useState(1)
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
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredDepartments.slice(start, start + pageSize)
  }, [filteredDepartments, page])

  const [activeDepartment, setActiveDepartment] = useState(null)

  const handleOpenDetails = (dept) => {
    setActiveDepartment(dept)
  }

  const handleCloseDetails = () => {
    setActiveDepartment(null)
  }

  const handleAdd = () => {
    alert('Add new department (demo).')
  }

  const handleEdit = (deptId) => {
    alert(`Edit department ${deptId} (demo).`)
  }

  const handleDelete = (deptId) => {
    if (window.confirm(`Delete department ${deptId}?`)) {
      alert(`Department ${deptId} deleted (demo).`)
    }
  }

  const handleAssignStaff = (deptId) => {
    alert(`Assign/reassign staff for ${deptId} (demo).`)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Departments</h1>
          <p>View and manage departments, staff assignments, and performance metrics.</p>
        </div>
        <button className={styles.primary} onClick={handleAdd}>
          Add department
        </button>
      </header>

      <section className={styles.filters}>
        <input
          className={styles.search}
          placeholder="Search by name, ID, or head..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <div className={styles.stats}>
          Showing {filteredDepartments.length} department{filteredDepartments.length === 1 ? '' : 's'}
        </div>
      </section>

      <div className={styles.list}>
        {paged.map((dept) => (
          <div key={dept.id} className={styles.card}>
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
              <span className={`${styles.statusBadge} ${dept.status === 'Active' ? styles.active : styles.inactive}`}>
                {dept.status}
              </span>
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
              <button className={styles.secondary} onClick={() => handleOpenDetails(dept)}>
                Details
              </button>
              <button className={styles.secondary} onClick={() => handleAssignStaff(dept.id)}>
                Assign staff
              </button>
              <button className={styles.secondary} onClick={() => handleEdit(dept.id)}>
                Edit
              </button>
              <button className={styles.danger} onClick={() => handleDelete(dept.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.pagination}>
        <button
          className={styles.secondary}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className={styles.secondary}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>

      {activeDepartment && (
        <div className={styles.drawer}>
          <div className={styles.drawerHeader}>
            <h3>{activeDepartment.name} details</h3>
            <button className={styles.close} onClick={handleCloseDetails}>
              Close
            </button>
          </div>

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
                <div>{activeDepartment.status}</div>
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
              <button className={styles.secondary} onClick={() => handleAssignStaff(activeDepartment.id)}>
                Manage staff
              </button>
              <button className={styles.primary} onClick={() => handleEdit(activeDepartment.id)}>
                Edit department
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
