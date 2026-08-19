import Card from '../common/UI/Card'
import Table from '../common/UI/Table'
import LoadingSpinner from '../common/UI/LoadingSpinner'
import Alert from '../common/UI/Alert'
import BarChart from '../common/charts/BarChart'

import styles from './DepartmentPerformance.module.css'

const UNAVAILABLE = '—'

const TABLE_COLUMNS = [
  {
    key: 'name',
    header: 'Department',
    render: (department) => department?.name || UNAVAILABLE,
  },
  {
    key: 'totalTickets',
    header: 'Total tickets',
    render: (department) => department?.totalTickets ?? UNAVAILABLE,
  },
  {
    key: 'openTickets',
    header: 'Open tickets',
    render: (department) => department?.openTickets ?? UNAVAILABLE,
  },
  {
    key: 'resolvedTickets',
    header: 'Resolved tickets',
    render: (department) => department?.resolvedTickets ?? UNAVAILABLE,
  },
  {
    key: 'resolutionRate',
    header: 'Resolution rate',
    render: (department) => formatResolutionRate(department?.resolutionRate),
  },
  {
    key: 'averageResolutionTime',
    header: 'Average resolution time',
    render: (department) => department?.averageResolutionTime ?? UNAVAILABLE,
  },
]

function formatResolutionRate(value) {
  if (value === null || value === undefined || value === '') return UNAVAILABLE
  if (typeof value === 'string' && value.trim().endsWith('%')) return value
  return `${value}%`
}

function getDepartmentKey(department, index) {
  return department?.id ?? department?.name ?? `department-${index}`
}

export default function DepartmentPerformance({
  departments = [],
  loading = false,
  error = null,
  view = 'table',
  className = '',
}) {
  const items = Array.isArray(departments) ? departments : []
  const errorMessage = error?.message ?? String(error)
  const chartData = items.map((department, index) => ({
    id: getDepartmentKey(department, index),
    name: department?.name || UNAVAILABLE,
    resolvedTickets: department?.resolvedTickets,
  }))

  return (
    <Card
      className={[styles.section, className].filter(Boolean).join(' ')}
      header={<h2 className={styles.title}>Department Performance</h2>}
    >
      {loading ? (
        <div className={styles.loading}>
          <LoadingSpinner size="medium" />
        </div>
      ) : error ? (
        <Alert type="error">{errorMessage}</Alert>
      ) : !items.length ? (
        <p className={styles.empty} role="status">No department performance data available.</p>
      ) : view === 'chart' ? (
        <div className={styles.chartWrap}>
          <BarChart
            data={chartData}
            xKey="name"
            bars={[{ name: 'Resolved tickets', dataKey: 'resolvedTickets', backgroundColor: '#2563eb' }]}
            title="Department performance"
            subtitle="Resolved tickets by department"
            height={320}
            showLegend={false}
          />
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <Table columns={TABLE_COLUMNS} data={items} compact bordered />
        </div>
      )}
    </Card>
  )
}