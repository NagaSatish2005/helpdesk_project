import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './NotFoundPage.module.css'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon} aria-hidden="true">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11.001 10H13.001V16H11.001z"
              fill="#2563EB"
            />
            <path
              d="M11 18H13V20H11V18ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
              fill="#2563EB"
            />
          </svg>
        </div>

        <h1>404 – Page Not Found</h1>
        <p className={styles.subtitle}>
          The page you are looking for does not exist or has been moved.
        </p>

        <div className={styles.buttons}>
          <button className={styles.primary} onClick={() => navigate('/')}>Home</button>
          <button className={styles.secondary} onClick={() => navigate(-1)}>Go back</button>
          <button className={styles.secondary} onClick={() => navigate('/student')}>Dashboard</button>
        </div>

        <div className={styles.help}>
          <p>
            Still stuck? <button className={styles.link} onClick={() => alert('Contact support (demo).')}>Contact support</button> or search the app.
          </p>
          <div className={styles.searchRow}>
            <input type="text" placeholder="Search tickets, pages, or help..." />
            <button className={styles.primary} onClick={() => alert('Search (demo).')}>Search</button>
          </div>
        </div>
      </div>
    </div>
  )
}
