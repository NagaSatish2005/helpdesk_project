import React, { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  Title as ChartTitle,
} from 'chart.js'

import styles from './BarChart.module.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTooltip, ChartLegend, ChartTitle)

const DEFAULT_COLORS = [
  '#2563eb', // blue
  '#16a34a', // green
  '#f59e0b', // amber
  '#dc2626', // red
  '#6b7280', // gray
  '#7c3aed', // purple
]

export default function BarChart({
  data = [],
  xKey,
  bars = [],
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
    if (!Array.isArray(bars) || bars.length === 0) return []
    return bars.map((bar, idx) => ({
      label: bar.name || bar.dataKey,
      data: safeData.map((d) => {
        const v = d && Object.prototype.hasOwnProperty.call(d, bar.dataKey) ? d[bar.dataKey] : 0
        return typeof v === 'number' ? v : Number(v) || 0
      }),
      backgroundColor: bar.backgroundColor || DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
      borderRadius: 6,
      barPercentage: 0.7,
      categoryPercentage: 0.7,
    }))
  }, [safeData, bars])

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

  const hasContent = !loading && safeData.length > 0 && Array.isArray(bars) && bars.length > 0

  return (
    <section className={[styles.wrapper, className].filter(Boolean).join(' ')} aria-label={title ? `${title} chart` : 'Bar chart'}>
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
          <Bar data={chartData} options={options} />
        )}
      </div>
    </section>
  )
}
