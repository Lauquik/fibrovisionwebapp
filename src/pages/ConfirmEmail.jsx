import { Link } from 'react-router-dom'

function ConfirmEmail() {
  const handleClose = () => {
    window.close()
  }

  return (
    <div className="app-shell">
      <div className="auth-page auth-page--centered">
        <section className="panel confirm-panel">
          <span className="panel-kicker">Thank You</span>
          <h1 className="confirm-title">Email Confirmed</h1>
          <p className="confirm-copy">
            Your email has been confirmed successfully. You can close this page now
            and continue in the app.
          </p>

          <div className="confirm-status-strip" aria-hidden="true">
            <span className="confirm-dot is-success" />
            <span className="confirm-dot is-success" />
            <span className="confirm-dot is-success" />
          </div>

          <div className="confirm-actions">
            <button className="action-button" type="button" onClick={handleClose}>
              Close Page
            </button>
            <Link className="ghost-button" to="/login">
              Back to Login
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ConfirmEmail
