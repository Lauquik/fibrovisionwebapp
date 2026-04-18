import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

function TodayRevisions({ onRevisionDone }) {
  const [revisions, setRevisions] = useState([])
  const [loading, setLoading] = useState(true)

//   const today = new Date().toISOString().split('T')[0]
  const today = '2026-04-19'

  useEffect(() => {
    fetchTodayRevisions()
  }, [])

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
    setRevisions(prev =>
      prev.map(rev => rev.id === id ? { ...rev, completed: true } : rev)
    )
    onRevisionDone()
  }
}

  if (loading) return <div style={styles.card}><p style={styles.muted}>Loading today's revisions...</p></div>

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h3 style={styles.title}>📅 Today's Revisions</h3>
        <span style={{
          ...styles.badge,
    background: revisions.filter(r => !r.completed).length > 0 ? '#fde68a' : '#d1fae5',
color: revisions.filter(r => !r.completed).length > 0 ? '#92400e' : '#065f46',
        }}>
        {revisions.filter(r => !r.completed).length > 0
        ? `${revisions.filter(r => !r.completed).length} pending`
        : 'All done!'}
        </span>
      </div>

      {revisions.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={styles.emptyIcon}>🎉</p>
          <p style={styles.emptyText}>No revisions due today. Great job!</p>
        </div>
      ) : (
        <div>
          {revisions.map(rev => (
            <div key={rev.id} style={styles.row}>
              <div style={styles.rowLeft}>
                <span style={styles.revBadge}>Rev {rev.revision_number}/7</span>
                <div>
                  <p style={styles.topicTitle}>{rev.topics.title}</p>
                  {rev.topics.description && (
                    <p style={styles.topicDesc}>{rev.topics.description}</p>
                  )}
                </div>
              </div>
                <button
                style={{
                    ...styles.doneBtn,
                    background: rev.completed ? '#16a34a' : '#4f46e5',
                    cursor: rev.completed ? 'default' : 'pointer'
                }}
                onClick={() => !rev.completed && markComplete(rev.id)}
                disabled={rev.completed}
                >
                {rev.completed ? '✓ Done' : 'Mark Done'}
                </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  card: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    boxShadow: '0 1px 3px rgba(0,0,0,0.07)'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  title: { margin: 0, fontSize: 17, fontWeight: 700 },
  badge: {
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 14px',
    borderRadius: 8,
    marginBottom: 8,
    background: '#f9fafb',
    border: '1px solid #e5e7eb'
  },
  rowLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12
  },
  revBadge: {
    background: '#e0e7ff',
    color: '#3730a3',
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    whiteSpace: 'nowrap'
  },
  topicTitle: { margin: 0, fontWeight: 600, fontSize: 15 },
  topicDesc: { margin: '2px 0 0', fontSize: 13, color: '#6b7280' },
  doneBtn: {
    padding: '7px 16px',
    background: '#4f46e5',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 14,
    whiteSpace: 'nowrap'
  },
  emptyState: { textAlign: 'center', padding: '16px 0' },
  emptyIcon: { fontSize: 32, margin: '0 0 8px' },
  emptyText: { color: '#6b7280', margin: 0 },
  muted: { color: '#9ca3af', textAlign: 'center' }
}

export default TodayRevisions