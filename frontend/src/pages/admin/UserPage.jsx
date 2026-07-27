import React, { useMemo, useState } from 'react'
import styles from './UserPage.module.css'

const sampleUsers = [
  {
    id: 'U-001',
    name: 'Emma Wells',
    email: 'emma.wells@example.com',
    role: 'Student',
    status: 'Active',
    created: '2026-01-15',
  },
  {
    id: 'U-002',
    name: 'Brian Chan',
    email: 'brian.chan@example.com',
    role: 'Staff',
    status: 'Active',
    created: '2026-01-20',
  },
  {
    id: 'U-003',
    name: 'Alice Park',
    email: 'alice.park@example.com',
    role: 'Admin',
    status: 'Inactive',
    created: '2026-02-01',
  },
  {
    id: 'U-004',
    name: 'Chen Li',
    email: 'chen.li@example.com',
    role: 'Staff',
    status: 'Active',
    created: '2026-02-10',
  },
  {
    id: 'U-005',
    name: 'Kamal Jain',
    email: 'kamal.jain@example.com',
    role: 'Student',
    status: 'Active',
    created: '2026-02-18',
  },
  {
    id: 'U-006',
    name: 'Dana Smith',
    email: 'dana.smith@example.com',
    role: 'Staff',
    status: 'Inactive',
    created: '2026-02-22',
  },
]

const roles = ['All', 'Student', 'Staff', 'Admin']
const statuses = ['All', 'Active', 'Inactive']

export default function UserPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [page, setPage] = useState(1)

  const pageSize = 5

  const filteredUsers = useMemo(() => {
    return sampleUsers
      .filter((user) => {
        if (roleFilter !== 'All' && user.role !== roleFilter) return false
        if (statusFilter !== 'All' && user.status !== statusFilter) return false
        if (!search) return true
        const lc = search.toLowerCase()
        return (
          user.name.toLowerCase().includes(lc) ||
          user.email.toLowerCase().includes(lc) ||
          user.id.toLowerCase().includes(lc)
        )
      })
      .sort((a, b) => (a.name > b.name ? 1 : -1))
  }, [search, roleFilter, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize))

  const pagedUsers = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredUsers.slice(start, start + pageSize)
  }, [filteredUsers, page])

  const handleAddNew = () => {
    alert('Add new user (demo).')
  }

  const handleEdit = (id) => {
    alert(`Edit user ${id} (demo).`)
  }

  const handleToggleStatus = (id, currentStatus) => {
    alert(`Set user ${id} to ${currentStatus === 'Active' ? 'Inactive' : 'Active'} (demo).`)
  }

  const handleDelete = (id) => {
    if (window.confirm(`Delete user ${id}? This cannot be undone.`)) {
      alert(`User ${id} deleted (demo).`)
    }
  }

  const handleViewDetails = (id) => {
    alert(`View details for ${id} (demo).`)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Users</h1>
          <p>View and manage user accounts, roles, and access.</p>
        </div>
        <button className={styles.primary} onClick={handleAddNew}>
          Add new user
        </button>
      </header>

      <section className={styles.filters}>
        <input
          className={styles.search}
          placeholder="Search by name, email or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <div className={styles.stats}>
          Showing {filteredUsers.length} user{filteredUsers.length === 1 ? '' : 's'}
        </div>
      </section>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pagedUsers.length === 0 ? (
            <tr>
              <td colSpan={7} className={styles.emptyRow}>
                No users found.
              </td>
            </tr>
          ) : (
            pagedUsers.map((user) => (
              <tr key={user.id}>
                <td className={styles.userId}>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span
                    className={`${styles.statusBadge} ${
                      user.status === 'Active' ? styles.active : styles.inactive
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td>{user.created}</td>
                <td className={styles.actions}>
                  <button className={styles.secondary} onClick={() => handleViewDetails(user.id)}>
                    View
                  </button>
                  <button className={styles.secondary} onClick={() => handleEdit(user.id)}>
                    Edit
                  </button>
                  <button
                    className={styles.secondary}
                    onClick={() => handleToggleStatus(user.id, user.status)}
                  >
                    {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button className={styles.danger} onClick={() => handleDelete(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

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
    </div>
  )
}
