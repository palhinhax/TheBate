"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error boundary caught:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              maxWidth: "28rem",
              width: "100%",
              textAlign: "center",
            }}
          >
            <div
              style={{
                marginBottom: "1.5rem",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "#ef4444" }}
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <h1
              style={{
                marginBottom: "1rem",
                fontSize: "1.875rem",
                fontWeight: "bold",
              }}
            >
              Something went wrong
            </h1>

            <p
              style={{
                marginBottom: "2rem",
                color: "#6b7280",
              }}
            >
              We&apos;re sorry, but something unexpected happened. Our team has
              been notified and is working to fix the issue.
            </p>

            {error.digest && (
              <p
                style={{
                  marginBottom: "1.5rem",
                  fontSize: "0.875rem",
                  color: "#6b7280",
                }}
              >
                Error ID: {error.digest}
              </p>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <button
                onClick={reset}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#2563eb",
                  color: "white",
                  borderRadius: "0.375rem",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Try Again
              </button>
              <a
                href="/"
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "transparent",
                  color: "#2563eb",
                  borderRadius: "0.375rem",
                  border: "1px solid #2563eb",
                  textDecoration: "none",
                  display: "block",
                  fontWeight: "500",
                }}
              >
                Go to Homepage
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
