import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './UnauthorizedPage.module.css'

export default function UnauthorizedPage() {
  const navigate = useNavigate()

  // In a real app this would come from auth state
  const userRole = 'Student'
  const requiredRole = 'Admin'

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon} aria-hidden="true">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
              fill="#dc2626"
            />
            <path
              d="M12 7V13"
              stroke="#dc2626"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M12 16H12.01"
              stroke="#dc2626"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <h1>403 – Unauthorized Access</h1>
        <p className={styles.subtitle}>
          You do not have permission to access this page. It may be restricted to administrators or users with specific roles.
        </p>

        <div className={styles.roleInfo}>
          <p>
            Your role: <strong>{userRole}</strong>
          </p>
          <p>
            Required role: <strong>{requiredRole}</strong>
          </p>
        </div>

        <div className={styles.buttons}>
          <button className={styles.primary} onClick={() => navigate('/')}>Home</button>
          <button className={styles.secondary} onClick={() => navigate('/student')}>Dashboard</button>
          <button className={styles.secondary} onClick={() => navigate(-1)}>Go back</button>
          <button className={styles.secondary} onClick={() => navigate('/login')}>Login</button>
        </div>

        <div className={styles.help}>
          <p>
            If you believe this is an error, please contact support for help.
          </p>
        </div>
      </div>
    </div>
  )
}
