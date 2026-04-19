import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate, Link } from 'react-router-dom'

function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted || !session) return
      navigate('/dashboard', { replace: true })
    })

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted || !session) return
      navigate('/dashboard', { replace: true })
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [navigate])

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    navigate('/login', {
      state: {
        message: 'Check your inbox and confirm your email to finish signing up.'
      }
    })
  }

  return (
    <div className="app-shell">
      <div className="auth-page">
        <div className="auth-layout">
          <section className="panel hero-panel">
            <div>
              <span className="hero-kicker">New Identity</span>
              <h1 className="hero-title">Initialize Access</h1>
              <p className="hero-copy">
                Build your personal revision terminal and keep every topic inside
                a sharper, darker workflow.
              </p>
            </div>

            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-label">Profile</span>
                <strong className="hero-stat-value">Encrypted</strong>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-label">Space</span>
                <strong className="hero-stat-value">Private</strong>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-label">Theme</span>
                <strong className="hero-stat-value">Neon Dark</strong>
              </div>
            </div>
          </section>

          <section className="panel form-panel">
            <span className="panel-kicker">Signup</span>
            <h2 className="panel-title">Create Operator Account</h2>
            <p className="panel-copy">
              Set up a username and credentials to start tracking revision rounds.
            </p>

            <form onSubmit={handleSignup} className="auth-form">
              <input
                className="input"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
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
              {error && <p className="error-text">{error}</p>}
              <button className="action-button" type="submit" disabled={loading}>
                {loading ? 'Provisioning...' : 'Create Account'}
              </button>
            </form>

            <p className="auth-switch">
              Already registered? <Link to="/login">Go to login</Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Signup
