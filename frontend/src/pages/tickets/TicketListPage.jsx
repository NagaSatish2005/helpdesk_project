import React, { useState } from 'react'
import styles from './TicketListPage.module.css'

export default function TicketListPage() {
	const [filter, setFilter] = useState('All')

	const tickets = [
		{ id: 'TCK-001', subject: 'Cannot login', status: 'Open' },
		{ id: 'TCK-002', subject: 'Laptop overheating', status: 'In Progress' },
		{ id: 'TCK-003', subject: 'WiFi slow', status: 'Closed' },
	]

	const filtered = filter === 'All' ? tickets : tickets.filter(t => t.status === filter)

	return (
		<div className={styles.container}>
			<h1>Tickets</h1>
			<div className={styles.filters}>
				<label>
					Status:
					<select value={filter} onChange={e => setFilter(e.target.value)}>
						<option>All</option>
						<option>Open</option>
						<option>In Progress</option>
						<option>Closed</option>
					</select>
				</label>
			</div>
			<table>
				<thead>
					<tr>
						<th>ID</th>
						<th>Subject</th>
						<th>Status</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{filtered.map(t => (
						<tr key={t.id}>
							<td>{t.id}</td>
							<td>{t.subject}</td>
							<td>
								<span className={`${styles.status} ${t.status}`}>{t.status}</span>
							</td>
							<td className={styles.actions}>
								<button className="view" onClick={() => alert('View')}>
									View
								</button>
								<button className="edit" onClick={() => alert('Edit')}>
									Edit
								</button>
								<button className="delete" onClick={() => alert('Delete')}>
									Delete
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
