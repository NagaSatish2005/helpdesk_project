import React, { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import styles from "./Sidebar.module.css";

const MENU_BY_ROLE = {
  Student: [
    { label: "Dashboard", path: "/student", icon: "grid" },
    { label: "My Tickets", path: "/my-tickets", icon: "ticket" },
    { label: "Create Ticket", path: "/create-ticket", icon: "plus" },
    { label: "Profile", path: "/profile", icon: "user" },
    { label: "Settings", path: "/settings", icon: "settings" },
  ],
  Staff: [
    { label: "Dashboard", path: "/staff", icon: "grid" },
    { label: "Assigned Tickets", path: "/tickets", icon: "ticket" },
    { label: "Ticket Management", path: "/tickets", icon: "clipboard" },
    { label: "Reports", path: "/reports", icon: "chart" },
    { label: "Profile", path: "/profile", icon: "user" },
  ],
  Admin: [
    { label: "Dashboard", path: "/admin", icon: "grid" },
    { label: "Users", path: "/users", icon: "users" },
    { label: "Departments", path: "/departments", icon: "building" },
    { label: "Reports", path: "/reports", icon: "chart" },
    { label: "System Settings", path: "/admin/settings", icon: "settings" },
    { label: "Analytics", path: "/reports", icon: "trend" },
  ],
};

function NavIcon({ name }) {
  const paths = {
    grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    ticket: <path d="M4 8a2 2 0 0 0 2-2h12a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H6a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4V8Z" />,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    user: <><circle cx="12" cy="8" r="3" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.12 2.12-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.04 1.56V20h-3v-.08A1.7 1.7 0 0 0 10.66 18.36a1.7 1.7 0 0 0-1.88.34l-.06.06L6.6 16.64l.06-.06A1.7 1.7 0 0 0 7 14.7 1.7 1.7 0 0 0 5.44 13.66H5v-3h.44A1.7 1.7 0 0 0 7 9.62a1.7 1.7 0 0 0-.34-1.88L6.6 7.68 8.72 5.56l.06.06a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 11.7 4.4V4h3v.4a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.12 2.12-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1.04H21v3h-.04A1.7 1.7 0 0 0 19.4 15Z" /></>,
    clipboard: <><rect x="6" y="5" width="12" height="15" rx="2" /><path d="M9 5V4h6v1M9 10h6M9 14h4" /></>,
    chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M18 20a5 5 0 0 0-2-4" /></>,
    building: <><path d="M4 20V5h12v15M16 9h4v11M2 20h20M8 9h4M8 13h4" /></>,
    trend: <><path d="m4 16 6-6 4 4 6-7M15 7h5v5" /></>,
  }
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

export default function Sidebar({ isOpen = true, onClose }) {
  const { user } = useAuth();
  const role = user?.role || "Student";
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("helpdesk_sidebar_collapsed") === "true";
  });

  const menuItems = useMemo(() => {
    return MENU_BY_ROLE[role] ?? MENU_BY_ROLE.Student;
  }, [role]);

  useEffect(() => {
    window.localStorage.setItem("helpdesk_sidebar_collapsed", isCollapsed ? "true" : "false");
  }, [isCollapsed]);

  useEffect(() => {
    const width = !isOpen ? 0 : isCollapsed ? 64 : 250;
    document.documentElement.style.setProperty("--sidebar-left-margin", `${width}px`);
  }, [isCollapsed, isOpen]);

  const handleMenuClick = () => {
    // Close the sidebar on mobile after navigation
    if (onClose && window.innerWidth < 900) onClose();
  };

  const handleToggleCollapsed = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <>
      <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""} ${isOpen ? styles.open : ""}`}>
        <div className={styles.brand}>
          <div className={styles.logo}><span>H</span></div>
          <div className={styles.brandInfo}>
            <div className={styles.brandTitle}>Helpdesk System</div>
            <div className={styles.brandSubtitle}>{role} view</div>
          </div>
        </div>

        <nav className={styles.nav} aria-label="Primary navigation">
          <p className={styles.navCaption}>Workspace</p>
          {menuItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                [styles.menuItem, isActive ? styles.menuItemActive : null].filter(Boolean).join(" ")
              }
              onClick={handleMenuClick}
            >
              <span className={styles.icon} aria-hidden>
                <NavIcon name={item.icon} />
              </span>
              <span className={styles.label}>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.footer}>
          <button
            type="button"
            className={styles.collapseButton}
            onClick={handleToggleCollapsed}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span className={styles.collapseIcon}>{isCollapsed ? "→" : "←"}</span>
            <span style={{ opacity: isCollapsed ? 0 : 1 }}>Collapse</span>
          </button>
        </div>
      </aside>
      <div className={styles.backdrop} onClick={onClose} />
    </>
  );
}
