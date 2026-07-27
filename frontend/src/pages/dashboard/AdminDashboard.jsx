import React from 'react'
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
	// sample analytics
	const analytics = {
		totalTickets: 120,
		open: 20,
		closed: 80,
		inProgress: 20,
	}

	const departmentPerformance = {
		labels: ['IT', 'Facilities', 'Academic'],
		datasets: [
			{
				data: [50, 40, 30],
				backgroundColor: ['#ff6384', '#36a2eb', '#ffcd56'],
			},
		],
	}

	const statusData = {
		labels: ['Open', 'In Progress', 'Closed'],
		datasets: [
			{
				data: [analytics.open, analytics.inProgress, analytics.closed],
				backgroundColor: ['#ff6384', '#36a2eb', '#4bc0c0'],
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
					<Pie data={statusData} />
				</div>
				<div className={styles.chartBox}>
					<h2>Department Performance</h2>
					<Pie data={departmentPerformance} />
				</div>
			</div>

			<div className={styles.controls}>
				<h2>Administrative Controls</h2>
				<button onClick={() => alert('Manage users')}>Manage Users</button>
				<button onClick={() => alert('Manage departments')}>Manage Departments</button>
			</div>
		</div>
	)
}
