import React, { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  Title as ChartTitle,
} from 'chart.js'

import styles from './LineChart.module.css'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTooltip, ChartLegend, ChartTitle)

const DEFAULT_COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#6b7280', '#7c3aed']

export default function LineChart({
  data = [],
  xKey,
  lines = [],
  title,
  subtitle,
  height = 350,
  loading = false,
  emptyMessage = 'No data available.',
  showLegend = true,
  showGrid = true,
  showTooltip = true,
  className = '',
}) {
  const safeData = Array.isArray(data) ? data : []

  const labels = useMemo(() => {
    if (!xKey) return safeData.map((_, i) => String(i))
    return safeData.map((d) => (d && d[xKey] != null ? String(d[xKey]) : ''))
  }, [safeData, xKey])

  const chartDatasets = useMemo(() => {
    if (!Array.isArray(lines) || lines.length === 0) return []
    return lines.map((line, idx) => ({
      label: line.name || line.dataKey,
      data: safeData.map((d) => {
        const v = d && Object.prototype.hasOwnProperty.call(d, line.dataKey) ? d[line.dataKey] : 0
        return typeof v === 'number' ? v : Number(v) || 0
      }),
      borderColor: line.borderColor || DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
      backgroundColor: line.backgroundColor || `${DEFAULT_COLORS[idx % DEFAULT_COLORS.length]}33`,
      tension: line.tension ?? 0.3,
      fill: line.fill ?? false,
      pointRadius: line.pointRadius ?? 3,
    }))
  }, [safeData, lines])

  const chartData = useMemo(() => ({ labels, datasets: chartDatasets }), [labels, chartDatasets])

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: Boolean(showLegend), position: 'top' },
        tooltip: { enabled: Boolean(showTooltip) },
        title: { display: false },
      },
      scales: {
        x: { grid: { display: Boolean(showGrid) } },
        y: { grid: { display: Boolean(showGrid) }, beginAtZero: true },
      },
      interaction: { mode: 'index', intersect: false },
    }),
    [showLegend, showGrid, showTooltip]
  )

  const hasContent = !loading && safeData.length > 0 && chartDatasets.length > 0

  return (
    <section className={[styles.wrapper, className].filter(Boolean).join(' ')} aria-label={title ? `${title} chart` : 'Line chart'}>
      {title ? <div className={styles.title}>{title}</div> : null}
      {subtitle ? <div className={styles.subtitle}>{subtitle}</div> : null}

      <div className={styles.chartWrap} style={{ height: `${height}px` }}>
        {loading ? (
          <div className={styles.skeleton} aria-hidden="true">
            <div className={styles.skelRow} />
            <div className={styles.skelRow} />
            <div className={styles.skelRow} />
          </div>
        ) : !safeData.length ? (
          <div className={styles.empty}>{emptyMessage}</div>
        ) : !chartDatasets.length ? (
          <div className={styles.empty}>No series configured.</div>
        ) : (
          <Line data={chartData} options={options} />
        )}
      </div>
    </section>
  )
}
