import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Alert from '../../components/common/UI/Alert'
import Button from '../../components/common/UI/Button'
import Card from '../../components/common/UI/Card'
import Input from '../../components/common/UI/Input'
import logo from '../../assets/logo.png'
import styles from './ForgotPasswordPage.module.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [validationError, setValidationError] = useState('')
  const [requestError, setRequestError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (loading) return

    const normalizedEmail = email.trim()
    if (!normalizedEmail) {
      setValidationError('Email is required.')
      return
    }
    if (!EMAIL_PATTERN.test(normalizedEmail)) {
      setValidationError('Enter a valid email address.')
      return
    }

    setValidationError('')
    setRequestError('')
    setSuccess(false)
    setLoading(true)

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 500))
      setSuccess(true)
      setEmail('')
    } catch {
      setRequestError('Unable to prepare reset instructions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.page}>
      <Card className={styles.card} padding="large">
        <div className={styles.branding}>
          <img src={logo} alt="Helpdesk System logo" className={styles.logo} />
          <span>Helpdesk System</span>
        </div>
        <div className={styles.heading}>
          <h1>Forgot password?</h1>
          <p>Enter your email and we will prepare password reset instructions for your account.</p>
        </div>

        {success ? (
          <Alert type="success" title="Reset request prepared">
            If an account exists for that email, password reset instructions have been prepared.
          </Alert>
        ) : null}
        {requestError ? <Alert type="error" title="Reset request failed">{requestError}</Alert> : null}

        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          <Input
            id="reset-email"
            name="email"
            type="email"
            label="Email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              if (validationError) setValidationError('')
              if (success) setSuccess(false)
            }}
            error={validationError}
            required
            autoComplete="email"
          />
          <Button type="submit" fullWidth loading={loading} disabled={loading}>
            {loading ? 'Preparing...' : 'Prepare reset instructions'}
          </Button>
        </form>

        <p className={styles.loginPrompt}>
          Remember your password? <Link to="/login">Back to sign in</Link>
        </p>
      </Card>
    </main>
  )
}
