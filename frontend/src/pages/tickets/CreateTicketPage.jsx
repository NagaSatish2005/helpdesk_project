import React, { useState } from 'react'
import styles from './CreateTicketPage.module.css'

export default function CreateTicketPage() {
	const [category, setCategory] = useState('Hostel')
	const [details, setDetails] = useState('')

	const handleSubmit = (e) => {
		e.preventDefault()
		// here we'd normally call an API
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
					<option>Hostel</option>
					<option>Transport</option>
					<option>Fees</option>
					<option>It</option>
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
