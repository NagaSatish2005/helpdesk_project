import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./ServerErrorPage.module.css";

function logServerError({ message, url, timestamp, user }) {
  const payload = {
    message,
    url,
    timestamp: timestamp || new Date().toISOString(),
    user: user || { id: "unknown" },
  };

  // In a real application, this would be sent to a remote logging service.
  // Here we log to console for development and debugging.
  console.error("Server Error Logged:", payload);
}

export default function ServerErrorPage({ errorMessage }) {
  const navigate = useNavigate();
  const location = useLocation();

  const message = errorMessage || "Something went wrong on our side.";
  const explanation =
    "The server encountered an unexpected condition and couldn't complete your request. The issue may be temporary.";

  useEffect(() => {
    logServerError({
      message,
      url: `${location.pathname}${location.search}`,
      timestamp: new Date().toISOString(),
    });
  }, [location.pathname, location.search, message]);

  const handleRefresh = () => window.location.reload();
  const handleContact = () => {
    const subject = encodeURIComponent("Helpdesk: Server Error");
    const body = encodeURIComponent(
      `I encountered a server error when accessing ${location.pathname}.

Details:
${message}`
    );
    window.location.href = `mailto:support@example.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon} aria-hidden="true">
          <svg
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 13V7h2v6h-2Zm0 4v-2h2v2h-2Z"
              fill="#DC2626"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm10-8a8 8 0 100 16 8 8 0 000-16Z"
              fill="#FEE2E2"
            />
          </svg>
        </div>

        <h1 className={styles.title}>500 - Internal Server Error</h1>
        <p className={styles.subtitle}>{message}</p>
        <p className={styles.explanation}>{explanation}</p>

        <div className={styles.buttons}>
          <button className={styles.primary} onClick={() => navigate("/")}> 
            Go to Home
          </button>
          <button className={styles.secondary} onClick={() => navigate("/student")}> 
            Go to Dashboard
          </button>
          <button className={styles.secondary} onClick={handleRefresh}>
            Try Again
          </button>
        </div>

        <div className={styles.help}>
          Still having trouble?{' '}
          <button className={styles.link} onClick={handleContact}>
            Contact Helpdesk
          </button>
          .
        </div>
      </div>
    </div>
  );
}
