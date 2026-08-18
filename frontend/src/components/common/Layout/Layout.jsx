import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import styles from './Layout.module.css'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [role, setRole] = useState('Student')

  useEffect(() => {
    const updateSidebarState = () => {
      if (window.innerWidth < 900) {
        setSidebarOpen(false)
        return
      }

      setSidebarOpen(true)
    }

    updateSidebarState()
    window.addEventListener('resize', updateSidebarState)

    return () => window.removeEventListener('resize', updateSidebarState)
  }, [])

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev)
  }

  const handleCloseSidebar = () => {
    if (window.innerWidth < 900) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className={styles.layout}>
      <Header onToggleSidebar={handleToggleSidebar} />

      <div className={styles.contentWrapper}>
        <Sidebar
          role={role}
          isOpen={sidebarOpen}
          onClose={handleCloseSidebar}
          onRoleChange={setRole}
        />

        <main className={styles.mainContent}>
          <section className={styles.pageContent}>
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  )
}
