import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useTickets from '../../hooks/useTickets'
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

function getCategoryLabel(category) {
	return String(category || 'Uncategorized')
		.replace(/_/g, ' ')
		.toLowerCase()
		.replace(/\b\w/g, (character) => character.toUpperCase())
		.replace(/\bIt\b/g, 'IT')
}

export default function StaffDashboard() {
	const navigate = useNavigate()
	const { tickets, updateTicket } = useTickets()
	const [resolvingTicketId, setResolvingTicketId] = useState(null)
	const [resolveError, setResolveError] = useState('')
	const assignedTickets = tickets.filter((ticket) => ticket.assignedTo != null)
	const resolvedTickets = tickets.filter((ticket) => ['Resolved', 'Closed'].includes(ticket.status))
	const inProgressTickets = tickets.filter((ticket) => ticket.status === 'In Progress')
	const openTickets = tickets.filter((ticket) => ticket.status === 'Open')
	const workload = {
		total: tickets.length,
		assigned: assignedTickets.length,
		pending: tickets.filter((ticket) => ticket.assignedTo == null).length,
		resolved: resolvedTickets.length,
		inProgress: inProgressTickets.length,
		open: openTickets.length,
	}

	const statusData = {
		labels: ['Open', 'In Progress', 'Resolved'],
		datasets: [
			{
				data: [workload.open, workload.inProgress, workload.resolved],
				backgroundColor: ['#36a2eb', '#ffcd56', '#4bc0c0'],
			},
		],
	}

	const categoryCounts = tickets.reduce((counts, ticket) => {
		const category = getCategoryLabel(ticket.category)
		counts[category] = (counts[category] || 0) + 1
		return counts
	}, {})

	const categoryData = {
		labels: Object.keys(categoryCounts),
		datasets: [
			{
				data: Object.values(categoryCounts),
				backgroundColor: ['#ff6384', '#ff9f40', '#36a2eb'],
			},
		],
	}

	const resolveTicket = async (ticketId) => {
		if (resolvingTicketId !== null) return

		setResolvingTicketId(ticketId)
		setResolveError('')
		try {
			await updateTicket(ticketId, { status: 'Resolved' })
		} catch (error) {
			setResolveError(error?.response?.data?.message || error?.message || 'Unable to resolve ticket.')
		} finally {
			setResolvingTicketId(null)
		}
	}

	const visibleTickets = tickets.map((ticket) => ({
		...ticket,
		student: ticket.creator?.name || ticket.requester?.name || 'Unassigned requester',
		issue: ticket.title || ticket.subject || 'Untitled ticket',
		workStatus: ['Resolved', 'Closed'].includes(ticket.status)
			? 'Resolved'
			: ticket.assignedTo ? 'Assigned' : 'Pending',
	}))

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
					<h2>Ticket Categories</h2>
					<Pie data={categoryData} />
				</div>
			</div>

			<div className={styles.tickets}>
				<h2>Open Tickets</h2>
				{resolveError ? <p role="alert">{resolveError}</p> : null}
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
							{visibleTickets.map((t) => (
							<tr key={t.id}>
								<td>{t.id}</td>
								<td>{t.student}</td>
								<td>{t.issue}</td>
								<td>{t.workStatus}</td>
								<td className={styles.actions}>
									<button className={styles.update} onClick={() => navigate(`/tickets/${t.id}`)}>
										Update
									</button>
									<button
										className={styles.resolve}
										onClick={() => resolveTicket(t.id)}
										disabled={resolvingTicketId === t.id}
									>
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
