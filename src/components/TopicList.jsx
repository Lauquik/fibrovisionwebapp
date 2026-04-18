// import { useState } from 'react'
// function TopicList({ topics }) {
//   const [expandedTopic, setExpandedTopic] = useState(null)

//   if (topics.length === 0) return (
//     <p style={{ color: '#6b7280', textAlign: 'center' }}>No topics yet. Add your first topic above!</p>
//   )

//   return (
//     <div>
//       <h3>Your Topics</h3>
//       {topics.map(topic => (
//         <div key={topic.id} style={styles.card}>
//             <div
//             style={styles.header}
//             onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
//             >
//             <strong>{topic.title}</strong>
//             <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
//                 <small style={styles.date}>Studied on: {topic.studied_at}</small>
//                 <span>{expandedTopic === topic.id ? '▲' : '▼'}</span>
//             </div>
//             </div>
//           {expandedTopic === topic.id && (
//             <p style={styles.desc}>{topic.description}</p>
//           )}
//         </div>
//       ))}
//     </div>
//   )
// }

// const styles = {
//   card: { border: '1px solid #e5e7eb', borderRadius: 10, marginBottom: 12, overflow: 'hidden' },
//   header: { padding: '14px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' },
//   desc: { margin: '4px 0 0', color: '#6b7280', fontSize: 17 },
//   date: { color: '#9ca3af', fontSize: 12 }
// }

// export default TopicList
import { useState } from 'react'
import { supabase } from '../supabaseClient'

function TopicList({ topics, onTopicDeleted }) {
  const [expandedTopic, setExpandedTopic] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const handleDelete = async (e, topicId) => {
    e.stopPropagation() // prevent expanding/collapsing when clicking delete
    if (!window.confirm('Delete this topic and all its revisions?')) return

    setDeletingId(topicId)
    const { error } = await supabase
      .from('topics')
      .delete()
      .eq('id', topicId)

    if (!error) onTopicDeleted()
    setDeletingId(null)
  }

  if (topics.length === 0) return (
    <p style={{ color: '#6b7280', textAlign: 'center' }}>No topics yet. Add your first topic above!</p>
  )

  return (
    <div>
      <h3>Your Topics</h3>
      {topics.map(topic => (
        <div key={topic.id} style={styles.card}>
          <div
            style={styles.header}
            onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
          >
            <strong>{topic.title}</strong>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <small style={styles.date}>Studied on: {topic.studied_at}</small>

              {/* Delete button */}
              <button
                style={{
                  ...styles.deleteBtn,
                  opacity: deletingId === topic.id ? 0.5 : 1
                }}
                onClick={(e) => handleDelete(e, topic.id)}
                disabled={deletingId === topic.id}
                title="Delete topic"
              >
                🗑️
              </button>

              <span>{expandedTopic === topic.id ? '▲' : '▼'}</span>
            </div>
          </div>
           {expandedTopic === topic.id && (
             <p style={styles.desc}>{topic.description}</p>
          )}
        </div>
      ))}
    </div>
  )
}

const styles = {
  card: { border: '1px solid #e5e7eb', borderRadius: 10, marginBottom: 12, overflow: 'hidden' },
  header: { padding: '14px 16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' },
  date: { color: '#9ca3af', fontSize: 12 },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 16,
    padding: '2px 4px',
    borderRadius: 4,
    lineHeight: 1
  }
}

export default TopicList