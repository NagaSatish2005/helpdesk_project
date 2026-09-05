import React, { useState } from 'react'
import { categories } from '../../assets/data/categories'
import useTickets from '../../hooks/useTickets'
import styles from './CreateTicketPage.module.css'

export default function CreateTicketPage() {
	const { addTicket } = useTickets()
	const [category, setCategory] = useState('Hostel')
	const [details, setDetails] = useState('')

	const handleSubmit = (e) => {
		e.preventDefault()
		const now = new Date().toISOString().slice(0, 10)
		addTicket({
			title: details.trim() || 'Untitled ticket',
			description: details.trim(),
			category,
			priority: 'Medium',
			status: 'Open',
			created: now,
			updated: now,
		})
		alert(`Ticket submitted:\nCategory: ${category}\nDetails: ${details}`)
	}

	return (
		<div className={styles.container}>
			<h1>Submit a Ticket</h1>
			<form onSubmit={handleSubmit}>
				<label htmlFor="category">Category</label>
				<select
					id="category"
					value={category}
					onChange={(e) => setCategory(e.target.value)}
				>
					{categories.map((ticketCategory) => (
						<option key={ticketCategory.id} value={ticketCategory.name}>
							{ticketCategory.name}
						</option>
					))}
				</select>

				<label htmlFor="details">Details</label>
				<textarea
					id="details"
					rows="4"
					value={details}
					onChange={(e) => setDetails(e.target.value)}
				/>

				<label htmlFor="attachment">Attachment (optional)</label>
			<input type="file" id="attachment" />
				<button type="submit">Submit Ticket</button>
			</form>
		</div>
	)
}
