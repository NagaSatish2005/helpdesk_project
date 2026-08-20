import React, { useMemo, useState } from 'react'
import jsPDF from 'jspdf'
import * as XLSX from 'xlsx'
import Alert from '../../components/common/UI/Alert'
import Button from '../../components/common/UI/Button'
import Select from '../../components/common/UI/Select'
import BarChart from '../../components/common/charts/BarChart'
import LineChart from '../../components/common/charts/LineChart'
import PieChart from '../../components/common/charts/PieChart'
import StatsCard from '../../components/common/charts/StatsCard'
import styles from './ReportsPage.module.css'

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

function filterByDateRange(tickets, rangeKey) {
  if (rangeKey === 'all') return tickets
  const days = rangeKey === '30d' ? 30 : 90
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return tickets.filter((ticket) => ticket?.created && new Date(ticket.created) >= cutoff)
}

function aggregateCountByKey(items, key) {
  return items.reduce((acc, item) => {
    const value = item[key] || 'Unknown'
    acc[value] = (acc[value] || 0) + 1
    return acc
  }, {})
}

const reportColumns = [
  ['Ticket ID', 'id'],
  ['Category', 'category'],
  ['Department', 'department'],
  ['Priority', 'priority'],
  ['Status', 'status'],
  ['Created', 'created'],
  ['Resolved', 'resolved'],
  ['Staff', 'staff'],
  ['Resolution Time (minutes)', 'resolutionTimeMins'],
]

function getReportRows(tickets) {
  return tickets.map((ticket) => Object.fromEntries(
    reportColumns.map(([header, key]) => [header, ticket?.[key] ?? ''])
  ))
}

function getExportDate() {
  return new Date().toISOString().slice(0, 10)
}

function getExportFilename(extension) {
  return `helpdesk-report-${getExportDate()}.${extension}`
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function exportCsv(tickets) {
  const rows = getReportRows(tickets)
  const headers = reportColumns.map(([header]) => header)
  const escapeCell = (value) => `"${String(value).replace(/"/g, '""')}"`
  const csv = [
    headers,
    ...rows.map((row) => headers.map((header) => row[header])),
  ]
    .map((row) => row.map(escapeCell).join(','))
    .join('\r\n')

  downloadBlob(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' }), getExportFilename('csv'))
}

function exportXlsx(tickets) {
  const worksheet = XLSX.utils.json_to_sheet(getReportRows(tickets))
  worksheet['!cols'] = reportColumns.map(([header]) => ({ wch: Math.max(header.length + 2, 16) }))
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Ticket Report')
  XLSX.writeFile(workbook, getExportFilename('xlsx'))
}

function exportPdf(tickets, filters) {
  const doc = new jsPDF({ orientation: 'landscape' })
  const rows = getReportRows(tickets)
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 14
  const columns = [
    ['ID', 'Ticket ID', 20],
    ['Category', 'Category', 29],
    ['Department', 'Department', 29],
    ['Priority', 'Priority', 24],
    ['Status', 'Status', 22],
    ['Created', 'Created', 27],
    ['Staff', 'Staff', 28],
    ['Resolution (min)', 'Resolution Time (minutes)', 38],
  ]

  const drawHeader = (y) => {
    doc.setFillColor(37, 99, 235)
    doc.setTextColor(255, 255, 255)
    doc.rect(margin, y - 5, pageWidth - margin * 2, 8, 'F')
    doc.setFont(undefined, 'bold')
    let x = margin + 2
    columns.forEach(([label, , width]) => {
      doc.text(label, x, y)
      x += width
    })
    doc.setFont(undefined, 'normal')
    doc.setTextColor(31, 41, 55)
  }

  doc.setFontSize(18)
  doc.setTextColor(17, 24, 39)
  doc.text('Helpdesk Report', margin, 18)
  doc.setFontSize(10)
  doc.text(`Export date: ${getExportDate()}`, margin, 26)
  doc.text(`Date range: ${filters.dateRange} | Department: ${filters.department} | Staff: ${filters.staff}`, margin, 33)
  doc.text(`Total tickets: ${tickets.length} | Closed: ${tickets.filter((ticket) => ticket.status === 'Closed').length} | Open: ${tickets.filter((ticket) => ticket.status !== 'Closed').length}`, margin, 40)

  doc.setFontSize(8)
  let y = 54
  drawHeader(y)
  y += 9

  rows.forEach((row) => {
    if (y > pageHeight - 16) {
      doc.addPage()
      y = 16
      drawHeader(y)
      y += 9
    }

    let x = margin + 2
    columns.forEach(([, key, width]) => {
      const value = row[key] === '' ? '-' : String(row[key])
      doc.text(value.slice(0, 24), x, y)
      x += width
    })
    doc.setDrawColor(229, 231, 235)
    doc.line(margin, y + 3, pageWidth - margin, y + 3)
    y += 8
  })

  doc.save(getExportFilename('pdf'))
}

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('30d')
  const [department, setDepartment] = useState('All')
  const [staff, setStaff] = useState('All')
  const [feedback, setFeedback] = useState(null)
  const [exporting, setExporting] = useState(null)

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
    return Object.entries(counts).map(([category, count]) => ({ category, count }))
  }, [filteredTickets])

  const priorityData = useMemo(() => {
    const counts = aggregateCountByKey(filteredTickets, 'priority')
    return Object.entries(counts).map(([priority, count]) => ({ priority, count }))
  }, [filteredTickets])

  const resolutionTimes = useMemo(() => {
    const completed = filteredTickets.filter((t) => t.resolutionTimeMins != null)
    return completed.map((ticket) => ({ ticket: ticket.id, minutes: Number(ticket.resolutionTimeMins) || 0 }))
  }, [filteredTickets])

  const staffPerformance = useMemo(() => {
    const counts = aggregateCountByKey(filteredTickets.filter((ticket) => ticket.status === 'Closed'), 'staff')
    return Object.entries(counts).map(([staffName, count]) => ({ staff: staffName, resolved: count }))
  }, [filteredTickets])

  const departmentBreakdown = useMemo(() => {
    const counts = aggregateCountByKey(filteredTickets, 'department')
    return Object.entries(counts).map(([departmentName, count]) => ({ department: departmentName, tickets: count }))
  }, [filteredTickets])

  const handleExport = async (key) => {
    if (exporting) return

    setExporting(key)
    setFeedback(null)

    try {
      await Promise.resolve()
      const filters = { dateRange, department, staff }
      if (key === 'csv') exportCsv(filteredTickets)
      if (key === 'xlsx') exportXlsx(filteredTickets)
      if (key === 'pdf') exportPdf(filteredTickets, filters)
      setFeedback({ title: 'Export complete', message: `The ${key.toUpperCase()} report was downloaded.`, type: 'success' })
    } catch (error) {
      console.error(`Failed to export ${key} report`, error)
      setFeedback({ title: 'Export failed', message: `The ${key.toUpperCase()} report could not be downloaded. Please try again.`, type: 'error' })
    } finally {
      setExporting(null)
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Reports</h1>
          <p>View ticket analytics with filters, charts, and export options.</p>
        </div>
        <div className={styles.controls}>
          <Select
            label="Date range"
            value={dateRange}
            options={dateOptions.map(({ key, label }) => ({ value: key, label }))}
            onChange={(e) => setDateRange(e.target.value)}
            className={styles.filter}
          />

          <Select
            label="Department"
            value={department}
            options={departments.map((value) => ({ value, label: value }))}
            onChange={(e) => setDepartment(e.target.value)}
            className={styles.filter}
          />

          <Select
            label="Staff"
            value={staff}
            options={staffMembers.map((value) => ({ value, label: value }))}
            onChange={(e) => setStaff(e.target.value)}
            className={styles.filter}
          />

          <div className={styles.exportGroup}>
            {exportOptions.map((opt) => (
              <Button
                key={opt.key}
                className={styles.exportButton}
                disabled={exporting === opt.key}
                onClick={() => handleExport(opt.key)}
              >
                {exporting === opt.key ? 'Exporting...' : opt.label}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <section className={styles.grid}>
        <div className={styles.summaryGrid}>
          <StatsCard title="Total tickets" value={filteredTickets.length} variant="primary" />
          <StatsCard title="Closed tickets" value={filteredTickets.filter((ticket) => ticket.status === 'Closed').length} variant="success" />
          <StatsCard title="Open tickets" value={filteredTickets.filter((ticket) => ticket.status !== 'Closed').length} variant="warning" />
        </div>

        <BarChart
          title="Category-wise report"
          subtitle="Tickets grouped by category."
          data={categoryData}
          xKey="category"
          bars={[{ dataKey: 'count', name: 'Tickets by category' }]}
          height={250}
          className={styles.chartCard}
        />

        <PieChart
          title="Priority-based report"
          subtitle="Distribution of tickets by priority."
          data={priorityData}
          nameKey="priority"
          dataKey="count"
          height={250}
          className={styles.chartCard}
        />

        <LineChart
          title="Resolution time report"
          subtitle="How long it takes to resolve tickets."
          data={resolutionTimes}
          xKey="ticket"
          lines={[{ dataKey: 'minutes', name: 'Resolution time (minutes)', fill: true, tension: 0.2 }]}
          height={250}
          showLegend={false}
          className={styles.chartCard}
        />

        <BarChart
          title="Staff performance"
          subtitle="Tickets resolved per staff member."
          data={staffPerformance}
          xKey="staff"
          bars={[{ dataKey: 'resolved', name: 'Resolved tickets' }]}
          height={250}
          showLegend={false}
          className={styles.chartCard}
        />

        <BarChart
          title="Department breakdown"
          subtitle="Tickets per department."
          data={departmentBreakdown}
          xKey="department"
          bars={[{ dataKey: 'tickets', name: 'Tickets' }]}
          height={250}
          showLegend={false}
          className={styles.chartCard}
        />
      </section>

      {feedback ? (
        <Alert type={feedback.type} title={feedback.title} closable onClose={() => setFeedback(null)} className={styles.feedback}>
          {feedback.message}
        </Alert>
      ) : null}
    </div>
  )
}
