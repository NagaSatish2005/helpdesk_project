import React, { useState } from 'react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    if (!email) {
      setError('Please enter your email address.')
      return
    }
    // Placeholder: replace with real password-reset API call
    console.log('Request password reset for', email)
    setMessage('If an account exists for that email, a reset link has been sent (demo).')
  }

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Reset password</h2>
        {error && <div style={styles.error}>{error}</div>}
        {message && <div style={styles.success}>{message}</div>}
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
        <button type="submit" style={styles.button}>Send reset link</button>
        <div style={styles.footer}><a href="/login">Back to sign in</a></div>
      </form>
    </div>
  )
}

const styles = {
  wrapper: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' },
  form: { width: 420, padding: 24, border: '1px solid #e6e6e6', borderRadius: 8, boxShadow: '0 2px 6px rgba(0,0,0,0.03)' },
  title: { margin: '0 0 12px 0', textAlign: 'center' },
  label: { display: 'block', marginBottom: 10, fontSize: 14 },
  input: { width: '100%', padding: '8px 10px', marginTop: 6, boxSizing: 'border-box' },
  button: { width: '100%', padding: '10px', marginTop: 12, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' },
  footer: { marginTop: 12, fontSize: 14, textAlign: 'center' },
  error: { background: '#fee2e2', color: '#b91c1c', padding: 8, borderRadius: 4, marginBottom: 8 },
  success: { background: '#ecfdf5', color: '#065f46', padding: 8, borderRadius: 4, marginBottom: 8 }
}
