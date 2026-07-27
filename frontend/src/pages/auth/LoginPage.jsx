import React, { useState } from 'react'
import logo from '../../assets/logo.png'

export default function LoginPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	function handleSubmit(e) {
		e.preventDefault()
		setError('')
		if (!email || !password) {
			setError('Please provide both email and password.')
			return
		}
		// Placeholder: replace with real auth call
		console.log('Logging in', { email })
		alert('Logged in (demo)')
	}

	return (
		<div style={styles.wrapper}>
			<form onSubmit={handleSubmit} style={styles.form}>
				<div style={styles.logoWrap}>
					<img src={logo} alt="Logo" style={styles.logoImage} />
				</div>
				<h2 style={styles.title}>Sign in</h2>
				{error && <div style={styles.error}>{error}</div>}
				<label style={styles.label}>
					Email
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						style={styles.input}
						required
					/>
				</label>
				<label style={styles.label}>
					Password
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						style={styles.input}
						required
					/>
				</label>
				<button type="submit" style={styles.button}>Sign in</button>
				<div style={{ marginTop: 8, textAlign: 'center' }}>
					<a href="/forgot-password">Forgot password?</a>
				</div>
				<div style={styles.footer}>Don't have an account? <a href="/signup">Create one</a></div>
			</form>
		</div>
	)
}

const styles = {
	wrapper: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' },
	form: { width: 360, padding: 24, border: '1px solid #e6e6e6', borderRadius: 8, boxShadow: '0 2px 6px rgba(0,0,0,0.03)' },
	title: { margin: '0 0 12px 0', textAlign: 'center' },
	label: { display: 'block', marginBottom: 10, fontSize: 14 },
	input: { width: '100%', padding: '8px 10px', marginTop: 6, boxSizing: 'border-box' },
	button: { width: '100%', padding: '10px', marginTop: 12, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' },
	footer: { marginTop: 12, fontSize: 14, textAlign: 'center' },
	error: { background: '#fee2e2', color: '#b91c1c', padding: 8, borderRadius: 4, marginBottom: 8 },
	logoWrap: { display: 'flex', justifyContent: 'center', marginBottom: 12 },
	logoImage: { height: 48 }
}

