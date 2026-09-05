import React from 'react'
import { departments } from '../../assets/data/departments'
import useTickets from '../../hooks/useTickets'
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
	const { tickets } = useTickets()
	const analytics = {
		totalTickets: tickets.length,
		open: tickets.filter((ticket) => ticket.status === 'Open').length,
		closed: tickets.filter((ticket) => ['Resolved', 'Closed'].includes(ticket.status)).length,
		inProgress: tickets.filter((ticket) => ticket.status === 'In Progress').length,
	}

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
