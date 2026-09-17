import React, { useState } from 'react'
import { categories } from '../../assets/data/categories'
import useTickets from '../../hooks/useTickets'
import styles from './CreateTicketPage.module.css'

const backendCategories = {
	Hostel: 'HOSTEL',
	Transport: 'TRANSPORT',
	Fees: 'FEES',
	It: 'IT',
	IT: 'IT',
	Facilities: 'FACILITIES',
	Software: 'SOFTWARE',
	Hardware: 'HARDWARE',
	Network: 'NETWORK',
	HR: 'HR',
	Finance: 'FINANCE',
}

export default function CreateTicketPage() {
	const { addTicket } = useTickets()
	const [category, setCategory] = useState('Hostel')
	const [details, setDetails] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (isSubmitting) return

		setIsSubmitting(true)
		try {
			await addTicket({
				title: details.trim() || 'Untitled ticket',
				description: details.trim(),
				category: backendCategories[category],
				priority: 'MEDIUM',
			})
			alert(`Ticket submitted:\nCategory: ${category}\nDetails: ${details}`)
			setDetails('')
		} catch (error) {
			const message = error?.response?.data?.message || error?.message || 'Unable to submit ticket.'
			alert(`Unable to submit ticket: ${message}`)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className={styles.container}>
			<div className={styles.heading}>
				<span className={styles.eyebrow}>Support centre</span>
				<h1>Submit a ticket</h1>
				<p>Share the details and the right team will pick it up.</p>
			</div>
			<form className={styles.form} onSubmit={handleSubmit}>
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
				<button className={styles.submit} type="submit" disabled={isSubmitting}>Submit ticket</button>
			</form>
		</div>
	)
}
