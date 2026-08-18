import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './StudentDashboard.module.css'
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

export default function StudentDashboard() {
	const navigate = useNavigate()
	// sample data; in a real application these would be fetched from an API
	const summary = {
		total: 32,
		open: 8,
		inProgress: 12,
		closed: 12,
	}

	const statusData = {
		labels: ['Open', 'In Progress', 'Closed'],
		datasets: [
			{
				data: [summary.open, summary.inProgress, summary.closed],
				backgroundColor: ['#ff6384', '#36a2eb', '#4bc0c0'],
			},
		],
	}

	const categoryData = {
		labels: ['Software', 'Hardware', 'Network', 'Other'],
		datasets: [
			{
				data: [10, 7, 9, 6],
				backgroundColor: ['#ffcd56', '#ff9f40', '#ff6384', '#4bc0c0'],
			},
		],
	}

	const recentTickets = [
		{ id: 'TCK-001', subject: 'Cannot login', status: 'Open' },
		{ id: 'TCK-002', subject: 'Laptop overheating', status: 'In Progress' },
		{ id: 'TCK-003', subject: 'WiFi slow', status: 'Closed' },
	]

	return (
		<div className={styles.container}>
			<h1>Student Dashboard</h1>

			<div className={styles.summary}>
				<div className={styles.card}>
					<h3>Total Tickets</h3>
					<p>{summary.total}</p>
				</div>
				<div className={styles.card}>
					<h3>Open</h3>
					<p>{summary.open}</p>
				</div>
				<div className={styles.card}>
					<h3>In Progress</h3>
					<p>{summary.inProgress}</p>
				</div>
				<div className={styles.card}>
					<h3>Closed</h3>
					<p>{summary.closed}</p>
				</div>
			</div>

			<div className={styles.charts}>
				<div className={styles.chartBox}>
					<h2>Status Distribution</h2>
					<Pie data={statusData} />
				</div>

				<div className={styles.chartBox}>
					<h2>Category-wise Tickets</h2>
					<Pie data={categoryData} />
				</div>
			</div>

			<div className={styles.recent}>
				<h2>Recent Tickets</h2>
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>Subject</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody>
						{recentTickets.map((t) => (
							<tr key={t.id}>
								<td>{t.id}</td>
								<td>{t.subject}</td>
								<td>{t.status}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className={styles.actions}>
				<button onClick={() => navigate('/create-ticket')} aria-label="Raise issue">Raise Issue</button>
				<button onClick={() => navigate('/my-tickets')} aria-label="Track issue">Track Issue</button>
			</div>
		</div>
	)
}
