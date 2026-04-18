import { useEffect, useEffectEvent, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import AddTopicForm from '../components/AddTopicForm'
import TopicList from '../components/TopicList'
import TodayRevisions from '../components/TodayRevisions'

function Dashboard() {
  const [topics, setTopics] = useState([])
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  const fetchTopics = async (userId) => {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!error) setTopics(data)
  }

  const fetchUserAndTopics = async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      navigate('/login')
      return
    }

    setUsername(user.user_metadata?.username || 'Student')
    fetchTopics(user.id)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const loadDashboard = useEffectEvent(async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      navigate('/login')
      return
    }

    setUsername(user.user_metadata?.username || 'Student')
    fetchTopics(user.id)
  })

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDashboard()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  const completedTopics = topics.filter((topic) => topic.description?.trim()).length

  return (
    <div className="app-shell">
      <div className="dashboard-page">
        <div className="dashboard-grid">
          <header className="panel dashboard-header">
            <div>
              <span className="panel-kicker">Operator Console</span>
              <h1 className="dashboard-title">Hello, {username}</h1>
              <p className="dashboard-subtitle">
                Monitor today&apos;s revision queue, register new topics, and keep
                your study system running like a clean command center.
              </p>
            </div>
            <button className="ghost-button danger" onClick={handleLogout}>
              Logout
            </button>
          </header>

          <section className="meta-grid">
            <div className="panel meta-tile">
              <span className="meta-label">Tracked Topics</span>
              <strong className="meta-value">{topics.length}</strong>
            </div>
            <div className="panel meta-tile">
              <span className="meta-label">Detailed Notes</span>
              <strong className="meta-value">{completedTopics}</strong>
            </div>
          </section>

          <div className="dashboard-panels">
            <div className="dashboard-grid">
              <TodayRevisions onRevisionDone={fetchUserAndTopics} />
              <AddTopicForm onTopicAdded={fetchUserAndTopics} />
            </div>

            <TopicList topics={topics} onTopicDeleted={fetchUserAndTopics} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
