import React, { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";

const MENU_BY_ROLE = {
  Student: [
    { label: "Dashboard", path: "/student", icon: "🏠" },
    { label: "My Tickets", path: "/my-tickets", icon: "🎫" },
    { label: "Create Ticket", path: "/create-ticket", icon: "➕" },
    { label: "Profile", path: "/profile", icon: "👤" },
    { label: "Settings", path: "/settings", icon: "⚙️" },
  ],
  Staff: [
    { label: "Dashboard", path: "/staff", icon: "🏠" },
    { label: "Assigned Tickets", path: "/tickets", icon: "🧾" },
    { label: "Ticket Management", path: "/tickets", icon: "📝" },
    { label: "Reports", path: "/reports", icon: "📊" },
    { label: "Profile", path: "/profile", icon: "👤" },
  ],
  Admin: [
    { label: "Dashboard", path: "/admin", icon: "🏠" },
    { label: "Users", path: "/users", icon: "👥" },
    { label: "Departments", path: "/departments", icon: "🏢" },
    { label: "Reports", path: "/reports", icon: "📊" },
    { label: "System Settings", path: "/settings", icon: "⚙️" },
    { label: "Analytics", path: "/reports", icon: "📈" },
  ],
};

export default function Sidebar({ role = "Student", isOpen = true, onClose, onRoleChange }) {
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

  const handleRoleChange = (event) => {
    const nextRole = event.target.value;
    if (onRoleChange) onRoleChange(nextRole);
  };

  return (
    <>
      <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""} ${isOpen ? styles.open : ""}`}>
        <div className={styles.brand}>
          <div className={styles.logo}>H</div>
          <div className={styles.brandInfo}>
            <div className={styles.brandTitle}>Helpdesk System</div>
            <div className={styles.brandSubtitle}>{role} view</div>
          </div>
        </div>

        <nav className={styles.nav} aria-label="Primary navigation">
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
                {item.icon}
              </span>
              <span className={styles.label}>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.footer}>
          <select
            className={styles.roleSelect}
            value={role}
            onChange={handleRoleChange}
            aria-label="Select role"
          >
            <option value="Student">Student</option>
            <option value="Staff">Staff</option>
            <option value="Admin">Admin</option>
          </select>
          <button
            type="button"
            className={styles.collapseButton}
            onClick={handleToggleCollapsed}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span>{isCollapsed ? "→" : "←"}</span>
            <span style={{ opacity: isCollapsed ? 0 : 1 }}>Collapse</span>
          </button>
        </div>
      </aside>
      <div className={styles.backdrop} onClick={onClose} />
    </>
  );
}
