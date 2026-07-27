import React from 'react'
import styles from './HomePage.module.css'
import logo from '../assets/logo.png'

export default function HomePage() {
  return (
    <main className={styles.root}>
      <div className={styles.nav}>
        <div className={styles.logo}>
          <img src={logo} alt="Logo" className={styles.logoImage} />
        </div>
        <div className={styles.links}>
          <a href="/login">Sign in</a>
          <a className={styles.signup} href="/signup">Sign up</a>
        </div>
      </div>

      <section className={styles.hero}>
        <h1 className={styles.title}>Your gateway to quick campus assistance</h1>
        <p className={styles.subtitle}>From reporting issues to tracking resolutions, this system brings students and departments together on one transparent platform.</p>

        <form className={styles.cta} onSubmit={(e) => { e.preventDefault(); window.location.href = '/signup'; }}>
          <input aria-label="email" placeholder="Enter your email" className={styles.email} />
          <button className={styles.primary}>Sign up for Free</button>
        </form>
      </section>

      <div className={styles.footerIllustration} aria-hidden />
    </main>
  )
}
