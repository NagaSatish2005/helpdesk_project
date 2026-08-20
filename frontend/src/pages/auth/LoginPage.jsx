import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Card from '../../components/common/UI/Card'
import LoginForm from '../../components/common/Forms/LoginForm'
import useAuth from '../../hooks/useAuth'
import logo from '../../assets/logo.png'
import styles from './LoginPage.module.css'

const ROLE_DESTINATIONS = {
  Student: '/student',
  Staff: '/staff',
  Admin: '/admin',
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (credentials) => {
    setError('')
    setLoading(true)
    try {
      const user = await login(credentials)
      const requestedPath = location.state?.from?.pathname
      navigate(requestedPath || ROLE_DESTINATIONS[user.role] || '/dashboard', { replace: true })
    } catch (loginError) {
      setError(loginError.message || 'Unable to sign in. Please try again.')
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
          <h1>Welcome back</h1>
          <p>Sign in to manage your helpdesk tickets and requests.</p>
        </div>
        <LoginForm onSubmit={handleSubmit} loading={loading} error={error} />
        <p className={styles.registerPrompt}>
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </p>
      </Card>
    </main>
  )
}

