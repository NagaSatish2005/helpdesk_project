import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Alert from '../../components/common/UI/Alert'
import Button from '../../components/common/UI/Button'
import Card from '../../components/common/UI/Card'
import RegisterForm from '../../components/common/Forms/RegisterForm'
import useAuth from '../../hooks/useAuth'
import logo from '../../assets/logo.png'
import styles from './SignUpPage.module.css'

export default function SignUpPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (form) => {
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      await register(form)
      setSuccess(true)
    } catch (registrationError) {
      setError(registrationError.message || 'Unable to create your account. Please try again.')
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
          <h1>Create your account</h1>
          <p>Join the helpdesk workspace to submit and track support requests.</p>
        </div>

        {success ? (
          <Alert type="success" title="Account created">
            Your account is ready. <Link to="/login">Sign in to continue.</Link>
          </Alert>
        ) : (
          <RegisterForm onSubmit={handleSubmit} loading={loading} error={error} />
        )}

        {success ? <Button className={styles.secondaryAction} variant="outline" onClick={() => navigate('/login')}>Go to sign in</Button> : null}
      </Card>
    </main>
  )
}
