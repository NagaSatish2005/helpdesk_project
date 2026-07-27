import React, { useMemo, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Line, Pie } from 'react-chartjs-2'
import styles from './ReportsPage.module.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
)

const sampleTickets = [
  { id: 'T-001', category: 'IT', department: 'Support', priority: 'High', status: 'Closed', created: '2026-02-22', resolved: '2026-02-24', staff: 'Alicia', resolutionTimeMins: 240 },
  { id: 'T-002', category: 'Facilities', department: 'Maintenance', priority: 'Low', status: 'Open', created: '2026-02-25', resolved: null, staff: 'Brian', resolutionTimeMins: null },
  { id: 'T-003', category: 'IT', department: 'Support', priority: 'Medium', status: 'Closed', created: '2026-02-23', resolved: '2026-02-23', staff: 'Alicia', resolutionTimeMins: 60 },
  { id: 'T-004', category: 'HR', department: 'HR', priority: 'Medium', status: 'Closed', created: '2026-03-01', resolved: '2026-03-04', staff: 'Chen', resolutionTimeMins: 450 },
  { id: 'T-005', category: 'Facilities', department: 'Maintenance', priority: 'High', status: 'Closed', created: '2026-03-03', resolved: '2026-03-03', staff: 'Brian', resolutionTimeMins: 120 },
  { id: 'T-006', category: 'IT', department: 'Support', priority: 'Low', status: 'Open', created: '2026-03-05', resolved: null, staff: 'Alicia', resolutionTimeMins: null },
  { id: 'T-007', category: 'Finance', department: 'Finance', priority: 'High', status: 'Closed', created: '2026-03-06', resolved: '2026-03-07', staff: 'Dana', resolutionTimeMins: 180 },
]

const dateOptions = [
  { key: '30d', label: 'Last 30 days' },
  { key: '90d', label: 'Last 90 days' },
  { key: 'all', label: 'All time' },
]

const exportOptions = [
  { key: 'csv', label: 'Export CSV' },
  { key: 'pdf', label: 'Export PDF' },
  { key: 'xlsx', label: 'Export XLSX' },
]

function toLabel(value) {
  return value
}

function filterByDateRange(tickets, rangeKey) {
  if (rangeKey === 'all') return tickets
  const days = rangeKey === '30d' ? 30 : 90
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return tickets.filter((ticket) => new Date(ticket.created) >= cutoff)
}

function aggregateCountByKey(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key] || 'Unknown'
    acc[value] = (acc[value] || 0) + 1
    return acc
  }, {})
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('30d')
  const [department, setDepartment] = useState('All')
  const [staff, setStaff] = useState('All')

  const filteredTickets = useMemo(() => {
    let data = filterByDateRange(sampleTickets, dateRange)
    if (department !== 'All') {
      data = data.filter((ticket) => ticket.department === department)
    }
    if (staff !== 'All') {
      data = data.filter((ticket) => ticket.staff === staff)
    }
    return data
  }, [dateRange, department, staff])

  const departments = useMemo(
    () => ['All', ...new Set(sampleTickets.map((t) => t.department))],
    []
  )

  const staffMembers = useMemo(
    () => ['All', ...new Set(sampleTickets.map((t) => t.staff))],
    []
  )

  const categoryData = useMemo(() => {
    const counts = aggregateCountByKey(filteredTickets, 'category')
    return {
      labels: Object.keys(counts).map(toLabel),
      datasets: [
        {
          label: 'Tickets by category',
          data: Object.values(counts),
          backgroundColor: ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a855f7'],
        },
      ],
    }
  }, [filteredTickets])

  const priorityData = useMemo(() => {
    const counts = aggregateCountByKey(filteredTickets, 'priority')
    return {
      labels: Object.keys(counts).map(toLabel),
      datasets: [
        {
          label: 'Tickets by priority',
          data: Object.values(counts),
          backgroundColor: ['#f97316', '#facc15', '#22c55e'],
        },
      ],
    }
  }, [filteredTickets])

  const resolutionTimes = useMemo(() => {
    const completed = filteredTickets.filter((t) => t.resolutionTimeMins != null)
    const mapped = completed.map((t) => ({ label: t.id, value: t.resolutionTimeMins }))
    return {
      labels: mapped.map((m) => m.label),
      datasets: [
        {
          label: 'Resolution time (minutes)',
          data: mapped.map((m) => m.value),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.35)',
          fill: true,
          tension: 0.2,
        },
      ],
    }
  }, [filteredTickets])

  const handleExport = (key) => {
    alert(`Exporting report as ${key.toUpperCase()} (demo only).`)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Reports</h1>
          <p>View ticket analytics with filters, charts, and export options.</p>
        </div>
        <div className={styles.controls}>
          <label>
            Date range
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
              {dateOptions.map(({ key, label }) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Department
            <select value={department} onChange={(e) => setDepartment(e.target.value)}>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </label>

          <label>
            Staff
            <select value={staff} onChange={(e) => setStaff(e.target.value)}>
              {staffMembers.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <div className={styles.exportGroup}>
            {exportOptions.map((opt) => (
              <button
                key={opt.key}
                type="button"
                className={styles.exportButton}
                onClick={() => handleExport(opt.key)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className={styles.grid}>
        <div className={styles.card}>
          <h2>Ticket summary</h2>
          <p className={styles.cardSubtext}>Overview of ticket count and status.</p>
          <div className={styles.summaryGrid}>
            <div>
              <div className={styles.summaryValue}>{filteredTickets.length}</div>
              <div className={styles.summaryLabel}>Total tickets</div>
            </div>
            <div>
              <div className={styles.summaryValue}>
                {filteredTickets.filter((t) => t.status === 'Closed').length}
              </div>
              <div className={styles.summaryLabel}>Closed tickets</div>
            </div>
            <div>
              <div className={styles.summaryValue}>
                {filteredTickets.filter((t) => t.status !== 'Closed').length}
              </div>
              <div className={styles.summaryLabel}>Open tickets</div>
            </div>
          </div>
        </div>

        <div className={styles.card}>
          <h2>Category-wise report</h2>
          <p className={styles.cardSubtext}>Tickets grouped by category.</p>
          <div className={styles.chartContainer}>
            <Bar data={categoryData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>

        <div className={styles.card}>
          <h2>Priority-based report</h2>
          <p className={styles.cardSubtext}>Distribution of tickets by priority.</p>
          <div className={styles.chartContainer}>
            <Pie data={priorityData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>

        <div className={styles.card}>
          <h2>Resolution time report</h2>
          <p className={styles.cardSubtext}>How long it takes to resolve tickets.</p>
          <div className={styles.chartContainer}>
            <Line data={resolutionTimes} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        </div>

        <div className={styles.card}>
          <h2>Staff performance</h2>
          <p className={styles.cardSubtext}>Tickets resolved per staff member.</p>
          <div className={styles.chartContainer}>
            <Bar
              data={{
                labels: Object.keys(aggregateCountByKey(filteredTickets.filter((t) => t.status === 'Closed'), 'staff')),
                datasets: [
                  {
                    label: 'Resolved tickets',
                    data: Object.values(
                      aggregateCountByKey(filteredTickets.filter((t) => t.status === 'Closed'), 'staff')
                    ),
                    backgroundColor: '#38bdf8',
                  },
                ],
              }}
              options={{ responsive: true, plugins: { legend: { display: false } } }}
            />
          </div>
        </div>

        <div className={styles.card}>
          <h2>Department breakdown</h2>
          <p className={styles.cardSubtext}>Tickets per department.</p>
          <div className={styles.chartContainer}>
            <Bar
              data={{
                labels: Object.keys(aggregateCountByKey(filteredTickets, 'department')),
                datasets: [
                  {
                    label: 'Tickets',
                    data: Object.values(aggregateCountByKey(filteredTickets, 'department')),
                    backgroundColor: '#a78bfa',
                  },
                ],
              }}
              options={{ responsive: true, plugins: { legend: { display: false } } }}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
