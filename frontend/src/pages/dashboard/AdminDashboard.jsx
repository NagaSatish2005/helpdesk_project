import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { departments } from '../../assets/data/departments'
import api from '../../services/api'
import styles from './AdminDashboard.module.css'
import {
	Chart as ChartJS,
	ArcElement,
	Tooltip,
	Legend,
	CategoryScale,
	LinearScale,
	BarElement,
} from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

export default function AdminDashboard() {
	const navigate = useNavigate()
	const [summary, setSummary] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	useEffect(() => {
		let isMounted = true

		api.get('/api/dashboard/summary')
			.then((response) => {
				if (isMounted) setSummary(response.data.data)
			})
			.catch(() => {
				if (isMounted) setError('Unable to load dashboard summary.')
			})
			.finally(() => {
				if (isMounted) setLoading(false)
			})

		return () => {
			isMounted = false
		}
	}, [])

	const departmentPerformance = {
		labels: departments.slice(0, 3).map((department) => department.name),
		datasets: [
			{
				data: departments.slice(0, 3).map((department) => department.ticketStats?.total || 0),
				backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56'],
			},
		],
	}

	const statusData = {
		labels: ['Open', 'In Progress', 'Resolved', 'Closed'],
		datasets: [
			{
				data: [
					summary?.openTickets || 0,
					summary?.inProgressTickets || 0,
					summary?.resolvedTickets || 0,
					summary?.closedTickets || 0,
				],
				backgroundColor: ['#ff6384', '#36a2eb', '#9966ff', '#4bc0c0'],
			},
		],
	}

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1>Admin Dashboard</h1>
			</div>

			<div className={styles.charts}>
				<div className={styles.chartBox}>
					<h2>Overall Ticket Status</h2>
					{loading ? <p>Loading dashboard summary...</p> : null}
					{error ? <p>{error}</p> : null}
					{!loading && !error ? <Pie data={statusData} /> : null}
				</div>
				<div className={styles.chartBox}>
					<h2>Department Performance</h2>
					<Pie data={departmentPerformance} />
				</div>
			</div>

			<div className={styles.controls}>
				<h2>Administrative Controls</h2>
				<button onClick={() => navigate('/admin/users')}>Manage Users</button>
				<button onClick={() => navigate('/admin/departments')}>Manage Departments</button>
			</div>
		</div>
	)
}
