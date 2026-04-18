import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate, Link, useLocation } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const message = location.state?.message ?? ''

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    navigate('/dashboard')
  }

  return (
    <div className="app-shell">
      <div className="auth-page">
        <div className="auth-layout">
          <section className="panel hero-panel">
            <div>
              <span className="hero-kicker">Secure Access</span>
              <h1 className="hero-title">Revision Control</h1>
              <p className="hero-copy">
                Step into a dark command-center workspace built for focused study,
                clean signal, and zero visual noise.
              </p>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-label">Mode</span>
                <strong className="hero-stat-value">Dark Ops</strong>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-label">Focus</span>
                <strong className="hero-stat-value">Revision</strong>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-label">Status</span>
                <strong className="hero-stat-value">Live</strong>
              </div>
            </div>
          </section>

          <section className="panel form-panel">
            <span className="panel-kicker">Login</span>
            <h2 className="panel-title">Authenticate Session</h2>
            <p className="panel-copy">
              Enter your credentials to access your revision dashboard.
            </p>

            <form onSubmit={handleLogin} className="auth-form">
              <input
                className="input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="input"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {message && <p className="status-text">{message}</p>}
              {error && <p className="error-text">{error}</p>}
              <button className="action-button" type="submit" disabled={loading}>
                {loading ? 'Authorizing...' : 'Enter Dashboard'}
              </button>
            </form>

            <p className="auth-switch">
              Need an account? <Link to="/signup">Create one</Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Login
