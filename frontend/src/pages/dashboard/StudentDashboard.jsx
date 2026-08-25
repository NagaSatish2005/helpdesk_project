import React from 'react'
import { useNavigate } from 'react-router-dom'
import ActivityFeed from '../../components/dashboard/ActivityFeed'
import DashboardStats from '../../components/dashboard/DashboardStats'
import RecentTickets from '../../components/dashboard/RecentTickets'
import Button from '../../components/common/UI/Button'
import Card from '../../components/common/UI/Card'
import useAuth from '../../hooks/useAuth'
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

const STUDENT_TICKETS = [
	{ id: 'TCK-001', title: 'Cannot login', status: 'Open', priority: 'High', category: 'Software', created: '2026-03-07' },
	{ id: 'TCK-002', title: 'Laptop overheating', status: 'In Progress', priority: 'Medium', category: 'Hardware', created: '2026-03-06' },
	{ id: 'TCK-003', title: 'WiFi slow', status: 'Closed', priority: 'Low', category: 'Network', created: '2026-03-05' },
]

export default function StudentDashboard() {
	const navigate = useNavigate()
	const { user } = useAuth()
	const studentName = user?.name || user?.fullName || 'Student'

	// This is the existing page-level mock data until a ticket source is available.
	const studentTickets = STUDENT_TICKETS

	const stats = {
		totalTickets: studentTickets.length,
		openTickets: studentTickets.filter((ticket) => ticket.status === 'Open').length,
		inProgressTickets: studentTickets.filter((ticket) => ticket.status === 'In Progress').length,
		resolvedTickets: studentTickets.filter((ticket) => ['Resolved', 'Closed'].includes(ticket.status)).length,
	}

	const statusData = {
		labels: ['Open', 'In Progress', 'Closed'],
		datasets: [{
			data: [stats.openTickets, stats.inProgressTickets, stats.resolvedTickets],
			backgroundColor: ['#ff6384', '#36a2eb', '#4bc0c0'],
		}],
	}

	const categoryCounts = studentTickets.reduce((result, ticket) => {
		const category = ticket.category || 'Other'
		result[category] = (result[category] || 0) + 1
		return result
	}, {})
	const categoryData = {
		labels: Object.keys(categoryCounts),
		datasets: [{
			data: Object.values(categoryCounts),
			backgroundColor: ['#ffcd56', '#ff9f40', '#ff6384', '#4bc0c0'],
		}],
	}

	const activities = studentTickets.map((ticket) => ({
		id: `activity-${ticket.id}`,
		type: ticket.status === 'Closed' ? 'ticket_resolved' : 'ticket_updated',
		message: `${ticket.id}: ${ticket.title}`,
		status: ticket.status,
		user: studentName,
		timestamp: ticket.created,
	}))

	return (
		<div className={styles.container}>
			<header className={styles.header}>
				<div>
					<h1>Welcome back, {studentName}</h1>
					<p>Track your support requests, review updates, and get help quickly.</p>
				</div>
				<Button onClick={() => navigate('/tickets/create')}>Create new ticket</Button>
			</header>

			<DashboardStats stats={stats} />

			<div className={styles.charts}>
				<Card className={styles.chartBox} title="Status distribution" subtitle="Your tickets by current status.">
					<Pie data={statusData} />
				</Card>

				<Card className={styles.chartBox} title="Category breakdown" subtitle="Your tickets grouped by category.">
					<Pie data={categoryData} />
				</Card>
			</div>

			<div className={styles.lowerGrid}>
				<RecentTickets
					tickets={studentTickets}
					onTicketClick={(ticket) => navigate(`/tickets/${ticket.id}`)}
					onViewAll={() => navigate('/my-tickets')}
				/>
				<ActivityFeed activities={activities} title="Your recent activity" />
			</div>

			<div className={styles.actions}>
				<Button variant="outline" onClick={() => navigate('/my-tickets')}>View my tickets</Button>
			</div>
		</div>
	)
}
