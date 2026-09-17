import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Alert from '../../components/common/UI/Alert'
import Button from '../../components/common/UI/Button'
import Card from '../../components/common/UI/Card'
import Input from '../../components/common/UI/Input'
import Modal from '../../components/common/UI/Modal'
import Pagination from '../../components/common/UI/Pagination'
import Select from '../../components/common/UI/Select'
import Table from '../../components/common/UI/Table'
import useUsers from '../../hooks/useUsers'
import api from '../../services/api'
import styles from './UserPage.module.css'

const roles = ['All', 'Student', 'Staff', 'Admin'].map((role) => ({ value: role, label: role }))
const statuses = ['All', 'Active', 'Inactive'].map((status) => ({ value: status, label: status }))

export default function UserPage() {
  const { users: sourceUsers, updateUser, deleteUser } = useUsers()
  const [backendUsers, setBackendUsers] = useState([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '' })
  const [createError, setCreateError] = useState('')
  const [creatingUser, setCreatingUser] = useState(false)
  const [deletingUser, setDeletingUser] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const pageSize = 5
  useEffect(() => {
    setBackendUsers(sourceUsers)
  }, [sourceUsers])

  // TODO: Replace the temporary Active placeholder when the backend provides user status.
  const users = useMemo(() => backendUsers.map((user) => ({
    ...user,
    status: 'Active',
  })), [backendUsers])

  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        if (roleFilter !== 'All' && user.role !== roleFilter) return false
        if (statusFilter !== 'All' && user.status !== statusFilter) return false
        if (!search) return true
        const lc = search.toLowerCase()
        return (
          user.name.toLowerCase().includes(lc) ||
          user.email.toLowerCase().includes(lc) ||
          String(user.id).toLowerCase().includes(lc)
        )
      })
      .sort((a, b) => Number(a.id) - Number(b.id))
  }, [users, search, roleFilter, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
  const safePage = Math.min(page, totalPages)

  const pagedUsers = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return filteredUsers.slice(start, start + pageSize)
  }, [filteredUsers, safePage])

  const showFeedback = (title, message, type = 'info') => {
    setFeedback({ title, message, type })
  }

  const closeModal = useCallback(() => {
    setModal(null)
  }, [])

  const handleAddNew = () => {
    setCreateForm({ name: '', email: '', password: '' })
    setCreateError('')
    setModal({ type: 'create', title: 'Add new staff user' })
  }

  const handleCreateUser = async (event) => {
    event.preventDefault()
    if (creatingUser) return

    const name = createForm.name.trim()
    const email = createForm.email.trim()
    if (!name || !email || !createForm.password) {
      setCreateError('Name, email, and password are required.')
      return
    }

    setCreatingUser(true)
    setCreateError('')
    try {
      await api.post('/api/users/staff', {
        name,
        email,
        password: createForm.password,
      })
      const response = await api.get('/api/users')
      setBackendUsers(Array.isArray(response.data?.data) ? response.data.data : [])
      setModal(null)
      showFeedback('User created', 'User created successfully.', 'success')
    } catch (error) {
      setCreateError(error?.response?.data?.message || error?.message || 'Unable to create user.')
    } finally {
      setCreatingUser(false)
    }
  }

  const handleEdit = (id) => {
    setModal({ type: 'info', title: 'Edit user', message: `Editing ${id} is still a local demo.` })
  }

  const handleToggleStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active'
    updateUser(id, { status: nextStatus })
    setModal({ type: 'info', title: `${nextStatus} user`, message: `Changing ${id} to ${nextStatus} is still a local demo.` })
  }

  const handleDelete = (id) => {
    setDeleteError('')
    setModal({ type: 'delete', title: 'Delete user', userId: id })
  }

  const confirmDelete = async () => {
  if (deletingUser) return

  setDeletingUser(true)
  setDeleteError('')
  try {
    await deleteUser(modal.userId)
    setModal(null)
    showFeedback('User deleted', 'User deleted successfully.', 'success')
  } catch (error) {
    setDeleteError(error?.message || 'Unable to delete user.')
  } finally {
    setDeletingUser(false)
  }
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
        onClose={closeModal}
        title={modal?.title}
        footer={modal?.type === 'delete' ? (
          <div className={styles.modalActions}>
            <Button variant="secondary" onClick={() => setModal(null)} disabled={deletingUser}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete} loading={deletingUser}>Delete</Button>
          </div>
        ) : modal?.type === 'create' ? (
          <div className={styles.modalActions}>
            <Button variant="secondary" onClick={() => setModal(null)} disabled={creatingUser}>Cancel</Button>
            <Button type="submit" form="create-user-form" loading={creatingUser}>Create user</Button>
          </div>
        ) : null}
      >
        {modal?.type === 'create' ? (
          <form id="create-user-form" onSubmit={handleCreateUser}>
            {createError ? <Alert type="error">{createError}</Alert> : null}
            <Input
              label="Name"
              value={createForm.name}
              onChange={(event) => setCreateForm((current) => ({ ...current, name: event.target.value }))}
              required
              disabled={creatingUser}
            />
            <Input
              label="Email"
              type="email"
              value={createForm.email}
              onChange={(event) => setCreateForm((current) => ({ ...current, email: event.target.value }))}
              required
              disabled={creatingUser}
            />
            <Input
              label="Password"
              type="password"
              value={createForm.password}
              onChange={(event) => setCreateForm((current) => ({ ...current, password: event.target.value }))}
              required
              disabled={creatingUser}
            />
          </form>
        ) : modal?.type === 'details' ? (
          <dl className={styles.details}>
            <dt>ID</dt><dd>{modal.user.id}</dd>
            <dt>Name</dt><dd>{modal.user.name}</dd>
            <dt>Email</dt><dd>{modal.user.email}</dd>
            <dt>Role</dt><dd>{modal.user.role}</dd>
            <dt>Status</dt><dd>{modal.user.status}</dd>
            <dt>Created</dt><dd>{modal.user.created}</dd>
          </dl>
        ) : modal?.type === 'delete' ? (
          <>
            {deleteError ? <Alert type="error">{deleteError}</Alert> : null}
            <p>Delete user {modal.userId}? This cannot be undone.</p>
          </>
        ) : modal ? (
          <p>{modal.message}</p>
        ) : null}
      </Modal>
    </div>
  )
}
