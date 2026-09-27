import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Alert from '../../components/common/UI/Alert'
import Badge from '../../components/common/UI/Badge'
import Button from '../../components/common/UI/Button'
import Card from '../../components/common/UI/Card'
import Input from '../../components/common/UI/Input'
import Modal from '../../components/common/UI/Modal'
import Pagination from '../../components/common/UI/Pagination'
import Select from '../../components/common/UI/Select'
import { useUserContext } from '../../context/UserContext'
import api from '../../services/api'
import styles from './DepartmentsPage.module.css'

const statuses = ['All', 'Active', 'Inactive'].map((status) => ({ value: status, label: status }))
const emptyForm = { name: '', description: '', active: 'true' }

function getErrorMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback
}

function staffMembers(department) {
  return Array.isArray(department?.staffMembers) ? department.staffMembers : []
}

export default function DepartmentsPage() {
  const { users } = useUserContext()
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [page, setPage] = useState(1)
  const [activeDepartment, setActiveDepartment] = useState(null)
  const [modal, setModal] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [assigning, setAssigning] = useState(false)
  const pageSize = 4

  const staffUsers = useMemo(() => users.filter((user) => (
    String(user.role || '').toUpperCase() === 'STAFF'
  )), [users])

  const loadDepartments = async () => {
    setLoading(true)
    setLoadError('')
    try {
      const response = await api.get('/api/departments')
      setDepartments(Array.isArray(response.data?.data) ? response.data.data : [])
    } catch (error) {
      setLoadError(getErrorMessage(error, 'Unable to load departments.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDepartments()
  }, [])

  const filteredDepartments = useMemo(() => departments
    .filter((department) => {
      const status = department.active ? 'Active' : 'Inactive'
      if (statusFilter !== 'All' && status !== statusFilter) return false
      if (!search) return true
      const query = search.toLowerCase()
      return department.name.toLowerCase().includes(query)
        || String(department.id).toLowerCase().includes(query)
        || staffMembers(department).some((staff) => staff.name.toLowerCase().includes(query))
    })
    .sort((first, second) => first.name.localeCompare(second.name)), [departments, search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filteredDepartments.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const paged = useMemo(() => {
    const start = (safePage - 1) * pageSize
    return filteredDepartments.slice(start, start + pageSize)
  }, [filteredDepartments, safePage])

  const showFeedback = (title, message, type = 'success') => setFeedback({ title, message, type })
  const handleCloseDetails = () => setActiveDepartment(null)
  const closeFormModal = useCallback(() => {
    setModal(null)
    setForm(emptyForm)
    setFormError('')
  }, [])

  const handleAdd = () => {
  closeFormModal()
    setFormError('')
    setModal({ type: 'create', title: 'Add department' })
  }

  const handleEdit = (department) => {
    handleCloseDetails()
    setForm({
      name: department.name || '',
      description: department.description || '',
      active: String(Boolean(department.active)),
    })
    setFormError('')
    setModal({ type: 'edit', title: 'Edit department', departmentId: department.id })
  }

  const handleAssignStaff = (department) => {
    handleCloseDetails()
    setForm({ ...emptyForm, name: '' })
    setFormError('')
    setModal({ type: 'assign', title: 'Manage staff', department })
  }

  const saveDepartment = async (event) => {
    event.preventDefault()
    if (saving) return
    if (!form.name.trim()) {
      setFormError('Department name is required.')
      return
    }

    setSaving(true)
    setFormError('')
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        active: form.active === 'true',
      }
      if (modal.type === 'create') await api.post('/api/departments', payload)
      else await api.patch(`/api/departments/${modal.departmentId}`, payload)
      await loadDepartments()
      setModal(null)
      showFeedback('Department saved', 'Department saved successfully.')
    } catch (error) {
      setFormError(getErrorMessage(error, 'Unable to save department.'))
    } finally {
      setSaving(false)
    }
  }

  const assignStaff = async (event) => {
    event.preventDefault()
    if (assigning || !form.name) return

    setAssigning(true)
    setFormError('')
    try {
      await api.patch(`/api/departments/${modal?.department?.id}/staff/${form.name}`)
      await loadDepartments()
      closeFormModal()
      showFeedback('Staff assigned', 'Staff member assigned successfully.')
    } catch (error) {
      setFormError(getErrorMessage(error, 'Unable to assign staff.'))
    } finally {
      setAssigning(false)
    }
  }

  const removeStaff = async (departmentId, userId) => {
    try {
      await api.delete(`/api/departments/${departmentId}/staff/${userId}`)
      await loadDepartments()
      setActiveDepartment(null)
      showFeedback('Staff removed', 'Staff member removed successfully.')
    } catch (error) {
      setFormError(getErrorMessage(error, 'Unable to remove staff member.'))
    }
  }

  const confirmDelete = async () => {
    if (saving) return
    setSaving(true)
    setFormError('')
    try {
      await api.delete(`/api/departments/${modal.departmentId}`)
      await loadDepartments()
      setModal(null)
      setForm(emptyForm)
      setFormError('')
      showFeedback('Department deleted', 'Department deleted successfully.')
    } catch (error) {
      setFormError(getErrorMessage(error, 'Unable to delete department.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Departments</h1>
          <p>View and manage departments and staff assignments.</p>
        </div>
        <Button onClick={handleAdd}>Add department</Button>
      </header>

      <section className={styles.filters}>
        <Input
          className={styles.search}
          placeholder="Search by name, ID, or staff..."
          value={search}
          aria-label="Search departments by name, ID, or staff"
          onChange={(event) => {
            setSearch(event.target.value)
            setPage(1)
          }}
        />
        <Select
          className={styles.filter}
          fullWidth={false}
          label="Status"
          value={statusFilter}
          options={statuses}
          onChange={(event) => {
            setStatusFilter(event.target.value)
            setPage(1)
          }}
        />
        <div className={styles.stats}>Showing {filteredDepartments.length} department{filteredDepartments.length === 1 ? '' : 's'}</div>
      </section>

      <div className={styles.list}>
        {loading ? <Card className={styles.emptyState}>Loading departments...</Card> : null}
        {!loading && loadError ? <Card className={styles.emptyState}>{loadError}</Card> : null}
        {!loading && !loadError && paged.length === 0 ? <Card className={styles.emptyState}>No departments found.</Card> : null}
        {!loading && !loadError ? paged.map((department, index) => {
          const displayNumber = (safePage - 1) * pageSize + index + 1
          const assignedStaff = staffMembers(department)
          const activeStaffCount = assignedStaff.filter((staff) => staff.active).length
          return (
            <Card key={department.id} className={styles.card} padding="none">
              <div className={styles.row}>
                <div>
                  <h2 className={styles.title}>{department.name}</h2>
                  <div className={styles.meta}>
                    <span>{displayNumber}</span>
                    <span>•</span>
                    <span>{activeStaffCount} active staff</span>
                  </div>
                </div>
                <Badge variant={department.active ? 'success' : 'danger'}>{department.active ? 'Active' : 'Inactive'}</Badge>
              </div>
              <p className={styles.description}>{department.description || 'No description provided.'}</p>
              <div className={styles.actions}>
                <Button size="small" variant="secondary" onClick={() => setActiveDepartment(department)}>Details</Button>
                <Button size="small" variant="secondary" onClick={() => handleAssignStaff(department)}>Assign staff</Button>
                <Button size="small" variant="secondary" onClick={() => handleEdit(department)}>Edit</Button>
                <Button size="small" variant="danger" onClick={() => {
                  setFormError('')
                  setModal({ type: 'delete', title: 'Delete department', departmentId: department.id })
                }}>Delete</Button>
              </div>
            </Card>
          )
        }) : null}
      </div>

      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={filteredDepartments.length}
        onPageChange={setPage}
        className={styles.pagination}
      />

      {feedback ? <Alert type={feedback.type} title={feedback.title} closable onClose={() => setFeedback(null)} className={styles.feedback}>{feedback.message}</Alert> : null}

      <Modal isOpen={Boolean(activeDepartment)} onClose={handleCloseDetails} title={activeDepartment ? `${activeDepartment.name} details` : ''} size="large">
        {activeDepartment ? (
          <div className={styles.drawerBody}>
            <div className={styles.drawerRow}>
              <div><strong>Department ID</strong><div>{activeDepartment.id}</div></div>
              <div><strong>Status</strong><div><Badge variant={activeDepartment.active ? 'success' : 'danger'}>{activeDepartment.active ? 'Active' : 'Inactive'}</Badge></div></div>
              <div><strong>Staff members</strong><div>{staffMembers(activeDepartment).length}</div></div>
            </div>
            <div className={styles.drawerRow}><div style={{ flex: 1 }}><strong>Description</strong><p className={styles.drawerDescription}>{activeDepartment.description || 'No description provided.'}</p></div></div>
            <div>
              <strong>Assigned Staff</strong>
              <div className={styles.staffList}>
                {staffMembers(activeDepartment).length === 0 ? <span>None assigned</span> : staffMembers(activeDepartment).map((staff) => (
                  <div className={styles.staffItem} key={staff.id}>
                    <span>{staff.name}</span>
                    <Button size="small" variant="danger" onClick={() => removeStaff(activeDepartment.id, staff.id)}>Remove</Button>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.drawerActions}>
              <Button variant="secondary" onClick={() => handleAssignStaff(activeDepartment)}>Manage staff</Button>
              <Button onClick={() => handleEdit(activeDepartment)}>Edit department</Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal isOpen={modal?.type === 'delete'} onClose={() => setModal(null)} title={modal?.title} footer={(
        <div className={styles.modalActions}>
          <Button variant="secondary" onClick={() => setModal(null)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete} loading={saving}>Delete</Button>
        </div>
      )}>
        <p>Delete department {modal?.departmentId}? This cannot be undone.</p>
        {formError ? <p className={styles.formError}>{formError}</p> : null}
      </Modal>

      <Modal isOpen={modal?.type === 'create' || modal?.type === 'edit'} onClose={closeFormModal} title={modal?.title}>
        <form className={styles.form} onSubmit={saveDepartment}>
          <Input label="Name" value={form.name} onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))} required />
          <Input label="Description" value={form.description} onChange={(event) => setForm((previous) => ({ ...previous, description: event.target.value }))} />
          <Select label="Status" value={form.active} options={[{ value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' }]} onChange={(event) => setForm((previous) => ({ ...previous, active: event.target.value }))} />
          {formError ? <p className={styles.formError}>{formError}</p> : null}
          <div className={styles.modalActions}><Button variant="secondary" onClick={closeFormModal}>Cancel</Button><Button type="submit" loading={saving}>Save</Button></div>
        </form>
      </Modal>

      <Modal isOpen={modal?.type === 'assign'} onClose={closeFormModal} title={modal?.title}>
        <form className={styles.form} onSubmit={assignStaff}>
          <Select
            label="Staff member"
            value={form.name}
            placeholder="Select a Staff user"
            options={staffUsers.filter((staff) => !staffMembers(modal?.department).some((assigned) => assigned.id === staff.id)).map((staff) => ({ value: String(staff.id), label: staff.name }))}
            onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))}
            required
          />
          {formError ? <p className={styles.formError}>{formError}</p> : null}
          <div className={styles.modalActions}><Button variant="secondary" onClick={closeFormModal}>Close</Button><Button type="submit" loading={assigning}>Assign</Button></div>
        </form>
      </Modal>
    </div>
  )
}
