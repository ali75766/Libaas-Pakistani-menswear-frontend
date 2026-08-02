import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application render error", error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          className="min-vh-100 d-flex align-items-center justify-content-center px-3"
          style={{ background: "var(--paper)" }}
        >
          <div
            className="text-center p-4 p-md-5"
            style={{
              maxWidth: 560,
              border: "1px solid rgba(201,168,76,0.3)",
              borderRadius: 24,
              background: "var(--white)",
              boxShadow: "0 18px 40px rgba(13,13,13,0.08)",
            }}
          >
            <div className="section-label mb-2">Something Went Wrong</div>
            <h1 className="section-title mb-3" style={{ fontSize: "2rem" }}>
              The page hit a render problem.
            </h1>
            <p className="font-sans mb-4" style={{ color: "var(--dark-grey)" }}>
              Try refreshing once. If it happens again, the error details below should make the
              issue visible instead of leaving the screen blank.
            </p>
            <pre
              className="text-start font-sans mb-4"
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                background: "rgba(13,13,13,0.05)",
                borderRadius: 16,
                padding: 16,
                color: "var(--off-black)",
                fontSize: "0.85rem",
              }}
            >
              {this.state.error?.message || "Unknown render error"}
            </pre>
            <button type="button" className="btn btn-gold" onClick={() => window.location.reload()}>
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
