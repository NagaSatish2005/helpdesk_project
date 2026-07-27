import React from 'react'
import styles from './StaffDashboard.module.css'
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

export default function StaffDashboard() {
	// sample dataset
	const workload = {
		total: 24,
		assigned: 18,
		pending: 6,
	}

	const statusData = {
		labels: ['Assigned', 'Pending', 'Resolved'],
		datasets: [
			{
				data: [workload.assigned, workload.pending, workload.total - workload.assigned - workload.pending],
				backgroundColor: ['#36a2eb', '#ffcd56', '#4bc0c0'],
			},
		],
	}

	const departmentData = {
		labels: ['Software', 'Hardware', 'Network'],
		datasets: [
			{
				data: [8, 7, 9],
				backgroundColor: ['#ff6384', '#ff9f40', '#36a2eb'],
			},
		],
	}

	const tickets = [
		{ id: 'STF-101', student: 'Alice', issue: 'Email not working', status: 'Assigned' },
		{ id: 'STF-102', student: 'Bob', issue: 'Lab computer crash', status: 'Pending' },
		{ id: 'STF-103', student: 'Charlie', issue: 'Printer jam', status: 'Assigned' },
	]

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1>Staff Dashboard</h1>
				<p>Department: IT Support</p>
			</div>

			<div className={styles.summary}>
				<div className={styles.card}>
					<h3>Total Workload</h3>
					<p>{workload.total}</p>
				</div>
				<div className={styles.card}>
					<h3>Assigned</h3>
					<p>{workload.assigned}</p>
				</div>
				<div className={styles.card}>
					<h3>Pending</h3>
					<p>{workload.pending}</p>
				</div>
			</div>

			<div className={styles.charts}>
				<div className={styles.chartBox}>
					<h2>Status Breakdown</h2>
					<Pie data={statusData} />
				</div>
				<div className={styles.chartBox}>
					<h2>Department Tickets</h2>
					<Pie data={departmentData} />
				</div>
			</div>

			<div className={styles.tickets}>
				<h2>Open Tickets</h2>
				<table>
					<thead>
						<tr>
							<th>ID</th>
							<th>Student</th>
							<th>Issue</th>
							<th>Status</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{tickets.map((t) => (
							<tr key={t.id}>
								<td>{t.id}</td>
								<td>{t.student}</td>
								<td>{t.issue}</td>
								<td>{t.status}</td>
								<td className={styles.actions}>
									<button className="update" onClick={() => alert('Update ticket')}>
										Update
									</button>
									<button className="resolve" onClick={() => alert('Resolve ticket')}>
										Resolve
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
