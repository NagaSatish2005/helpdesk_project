import React, { useMemo } from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend as ChartLegend, Title as ChartTitle } from 'chart.js'

import styles from './PieChart.module.css'

ChartJS.register(ArcElement, ChartTooltip, ChartLegend, ChartTitle)

const DEFAULT_COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#6b7280', '#7c3aed']

export default function PieChart({
  data = [],
  dataKey = 'value',
  nameKey = 'name',
  title,
  subtitle,
  height = 350,
  loading = false,
  emptyMessage = 'No data available.',
  showLegend = true,
  showTooltip = true,
  donut = false,
  className = '',
}) {
  const safeData = Array.isArray(data) ? data : []

  const validItems = useMemo(() => {
    return safeData.filter((d) => d && Object.prototype.hasOwnProperty.call(d, dataKey))
  }, [safeData, dataKey])

  const labels = useMemo(() => validItems.map((d) => (d && d[nameKey] != null ? String(d[nameKey]) : '')), [validItems, nameKey])

  const values = useMemo(() => validItems.map((d) => {
    const v = d[dataKey]
    return typeof v === 'number' ? v : Number(v) || 0
  }), [validItems, dataKey])

  const backgroundColor = useMemo(() => {
    return labels.map((_, i) => DEFAULT_COLORS[i % DEFAULT_COLORS.length])
  }, [labels])

  const chartData = useMemo(() => ({
    labels,
    datasets: [
      {
        data: values,
        backgroundColor,
        borderWidth: 0,
      },
    ],
  }), [labels, values, backgroundColor])

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: Boolean(showLegend), position: 'bottom' },
      tooltip: { enabled: Boolean(showTooltip) },
      title: { display: false },
    },
    cutout: donut ? '60%' : '0%',
  }), [showLegend, showTooltip, donut])

  const hasContent = !loading && values.length > 0

  return (
    <section className={[styles.wrapper, className].filter(Boolean).join(' ')} aria-label={title ? `${title} pie chart` : 'Pie chart'}>
      {title ? <div className={styles.title}>{title}</div> : null}
      {subtitle ? <div className={styles.subtitle}>{subtitle}</div> : null}

      <div className={styles.chartWrap} style={{ height: `${height}px` }}>
        {loading ? (
          <div className={styles.skeleton} aria-hidden="true">
            <div className={styles.skelCircle} />
            <div className={styles.skelRow} />
          </div>
        ) : !hasContent ? (
          <div className={styles.empty}>{emptyMessage}</div>
        ) : (
          <Pie data={chartData} options={options} />
        )}
      </div>
    </section>
  )
}
