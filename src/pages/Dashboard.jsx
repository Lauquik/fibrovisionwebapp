import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useNavigate } from 'react-router-dom'
import AddTopicForm from '../components/AddTopicForm'
import TopicList from '../components/TopicList'
import TodayRevisions from '../components/TodayRevisions'   // ← add this


function Dashboard() {
  const [topics, setTopics] = useState([])
  const [username, setUsername] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchUserAndTopics()
  }, [])

  const fetchUserAndTopics = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUsername(user?.user_metadata?.username || 'Student')
    fetchTopics(user.id)
  }

  const fetchTopics = async (userId) => {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!error) setTopics(data)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={{ margin: 0 }}>👋 Hello, {username}!</h2>
            <p style={styles.subtitle}>Track and revise your topics</p>
          </div>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>

        {/* Today's Revisions */}
        <TodayRevisions onRevisionDone={fetchUserAndTopics} />   {/* ← add this */}

        {/* Add Topic */}
        <AddTopicForm onTopicAdded={fetchUserAndTopics} />

        {/* Topic List */}
        <TopicList topics={topics} onTopicDeleted={fetchUserAndTopics} />

      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: '#f3f4f6', padding: '30px 16px', fontFamily: 'sans-serif' },
  container: { maxWidth: 700, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  subtitle: { margin: '4px 0 0', color: '#6b7280', fontSize: 14 },
  logoutBtn: { padding: '8px 16px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }
}

export default Dashboard