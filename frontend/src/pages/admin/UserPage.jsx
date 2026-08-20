import React, { useMemo, useState } from 'react'
import Alert from '../../components/common/UI/Alert'
import Button from '../../components/common/UI/Button'
import Card from '../../components/common/UI/Card'
import Input from '../../components/common/UI/Input'
import Modal from '../../components/common/UI/Modal'
import Pagination from '../../components/common/UI/Pagination'
import Select from '../../components/common/UI/Select'
import Table from '../../components/common/UI/Table'
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

const roles = ['All', 'Student', 'Staff', 'Admin'].map((role) => ({ value: role, label: role }))
const statuses = ['All', 'Active', 'Inactive'].map((status) => ({ value: status, label: status }))

export default function UserPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(null)
  const [feedback, setFeedback] = useState(null)

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
  const safePage = Math.min(page, totalPages)

  const pagedUsers = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return filteredUsers.slice(start, start + pageSize)
  }, [filteredUsers, safePage])

  const showFeedback = (title, message, type = 'info') => {
    setFeedback({ title, message, type })
  }

  const handleAddNew = () => {
    setModal({ type: 'info', title: 'Add new user', message: 'User creation is still a local demo.' })
  }

  const handleEdit = (id) => {
    setModal({ type: 'info', title: 'Edit user', message: `Editing ${id} is still a local demo.` })
  }

  const handleToggleStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active'
    setModal({ type: 'info', title: `${nextStatus} user`, message: `Changing ${id} to ${nextStatus} is still a local demo.` })
  }

  const handleDelete = (id) => {
    setModal({ type: 'delete', title: 'Delete user', userId: id })
  }

  const handleViewDetails = (user) => {
    setModal({ type: 'details', title: 'User details', user })
  }

  const columns = [
    { key: 'id', header: 'ID', render: (user) => <span className={styles.userId}>{user.id}</span> },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
    {
      key: 'status',
      header: 'Status',
      render: (user) => (
        <span className={`${styles.statusBadge} ${user.status === 'Active' ? styles.active : styles.inactive}`}>
          {user.status}
        </span>
      ),
    },
    { key: 'created', header: 'Created' },
    {
      key: 'actions',
      header: 'Actions',
      render: (user) => (
        <div className={styles.actions}>
          <Button size="small" variant="secondary" onClick={() => handleViewDetails(user)}>View</Button>
          <Button size="small" variant="secondary" onClick={() => handleEdit(user.id)}>Edit</Button>
          <Button size="small" variant="secondary" onClick={() => handleToggleStatus(user.id, user.status)}>
            {user.status === 'Active' ? 'Deactivate' : 'Activate'}
          </Button>
          <Button size="small" variant="danger" onClick={() => handleDelete(user.id)}>Delete</Button>
        </div>
      ),
    },
  ]

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Users</h1>
          <p>View and manage user accounts, roles, and access.</p>
        </div>
        <Button onClick={handleAddNew}>Add new user</Button>
      </header>

      <section className={styles.filters}>
        <Input
          className={styles.search}
          placeholder="Search by name, email or ID..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(1)
          }}
        />

        <Select
          className={styles.filter}
          fullWidth={false}
          value={roleFilter}
          options={roles}
          onChange={(e) => {
            setRoleFilter(e.target.value)
            setPage(1)
          }}
        />
        <Select
          className={styles.filter}
          fullWidth={false}
          value={statusFilter}
          options={statuses}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
        />

        <div className={styles.stats}>
          Showing {filteredUsers.length} user{filteredUsers.length === 1 ? '' : 's'}
        </div>
      </section>

      <Card padding="none" className={styles.tableCard}>
        <Table className={styles.table} columns={columns} data={pagedUsers} emptyMessage="No users found." />
      </Card>

      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={filteredUsers.length}
        onPageChange={setPage}
        className={styles.pagination}
      />

      {feedback ? (
        <Alert type={feedback.type} title={feedback.title} closable onClose={() => setFeedback(null)} className={styles.feedback}>
          {feedback.message}
        </Alert>
      ) : null}

      <Modal
        isOpen={Boolean(modal)}
        onClose={() => setModal(null)}
        title={modal?.title}
        footer={modal?.type === 'delete' ? (
          <div className={styles.modalActions}>
            <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
            <Button variant="danger" onClick={() => {
              showFeedback('User deleted', `User ${modal.userId} deleted (demo).`, 'success')
              setModal(null)
            }}>Delete</Button>
          </div>
        ) : null}
      >
        {modal?.type === 'details' ? (
          <dl className={styles.details}>
            <dt>ID</dt><dd>{modal.user.id}</dd>
            <dt>Name</dt><dd>{modal.user.name}</dd>
            <dt>Email</dt><dd>{modal.user.email}</dd>
            <dt>Role</dt><dd>{modal.user.role}</dd>
            <dt>Status</dt><dd>{modal.user.status}</dd>
            <dt>Created</dt><dd>{modal.user.created}</dd>
          </dl>
        ) : modal?.type === 'delete' ? (
          <p>Delete user {modal.userId}? This cannot be undone.</p>
        ) : modal ? (
          <p>{modal.message}</p>
        ) : null}
      </Modal>
    </div>
  )
}
