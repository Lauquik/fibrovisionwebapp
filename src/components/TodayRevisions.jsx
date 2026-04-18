import { useEffect, useEffectEvent, useState } from 'react'
import { supabase } from '../supabaseClient'

const getLocalDateString = () => {
  const now = new Date()
  const offsetMs = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - offsetMs).toISOString().split('T')[0]
}

function TodayRevisions({ onRevisionDone }) {
  const [revisions, setRevisions] = useState([])
  const [loading, setLoading] = useState(true)

  const today = getLocalDateString()
  const pendingCount = revisions.filter((revision) => !revision.completed).length

  const fetchTodayRevisions = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('revision_schedule')
      .select(`
        *,
        topics (
          title,
          description
        )
      `)
      .eq('scheduled_date', today)
      .order('revision_number')

    if (!error) setRevisions(data)
    setLoading(false)
  }

  const markComplete = async (id) => {
    const { error } = await supabase
      .from('revision_schedule')
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq('id', id)

    if (!error) {
      setRevisions((prev) =>
        prev.map((revision) =>
          revision.id === id ? { ...revision, completed: true } : revision
        )
      )
      onRevisionDone()
    }
  }

  const loadTodayRevisions = useEffectEvent(async () => {
    await fetchTodayRevisions()
  })

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadTodayRevisions()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  return (
    <section className="panel data-card">
      <div className="card-header">
        <div>
          <span className="panel-kicker">Today</span>
          <h3 className="panel-title">Revision Queue</h3>
        </div>
        <span className={`badge ${pendingCount > 0 ? 'warning' : 'success'}`}>
          {loading ? 'Scanning...' : pendingCount > 0 ? `${pendingCount} pending` : 'All clear'}
        </span>
      </div>

      {loading ? (
        <p className="muted">Loading today&apos;s revisions...</p>
      ) : revisions.length === 0 ? (
        <div className="empty-state">
          <p className="empty-title">No tasks due</p>
          <p className="empty-copy">Nothing is scheduled for today. Enjoy the quiet screen.</p>
        </div>
      ) : (
        <div className="revision-list">
          {revisions.map((revision) => (
            <div key={revision.id} className="revision-row">
              <div className="revision-main">
                <span className="revision-step">Rev {revision.revision_number}/7</span>
                <div>
                  <p className="topic-name">{revision.topics.title}</p>
                  {revision.topics.description && (
                    <p className="topic-desc">{revision.topics.description}</p>
                  )}
                </div>
              </div>

              <button
                className={revision.completed ? 'ghost-button' : 'action-button'}
                onClick={() => !revision.completed && markComplete(revision.id)}
                disabled={revision.completed}
              >
                {revision.completed ? 'Completed' : 'Mark Done'}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default TodayRevisions
