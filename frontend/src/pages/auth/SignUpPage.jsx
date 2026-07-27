import React, { useState } from 'react'

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!name || !email || !password || !confirm) {
      setError('Please fill all fields.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters.')
      return
    }
    // Placeholder: replace with real signup API call
    console.log('Signing up', { name, email })
    setSuccess('Account created (demo). You can now sign in.')
    setName('')
    setEmail('')
    setPassword('')
    setConfirm('')
  }

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Create account</h2>
        {error && <div style={styles.error}>{error}</div>}
        {success && <div style={styles.success}>{success}</div>}
        <label style={styles.label}>
          Full name
          <input value={name} onChange={(e) => setName(e.target.value)} style={styles.input} required />
        </label>
        <label style={styles.label}>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} required />
        </label>
        <label style={styles.label}>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} required />
        </label>
        <label style={styles.label}>
          Confirm password
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} style={styles.input} required />
        </label>
        <button type="submit" style={styles.button}>Create account</button>
        <div style={styles.footer}>Already have an account? <a href="/login">Sign in</a></div>
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
  button: { width: '100%', padding: '10px', marginTop: 12, background: '#059669', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' },
  footer: { marginTop: 12, fontSize: 14, textAlign: 'center' },
  error: { background: '#fee2e2', color: '#b91c1c', padding: 8, borderRadius: 4, marginBottom: 8 },
  success: { background: '#ecfdf5', color: '#065f46', padding: 8, borderRadius: 4, marginBottom: 8 }
}
