import { useState } from 'react'
import { supabase } from '../supabaseClient'

function TopicList({ topics, onTopicDeleted }) {
  const [expandedTopic, setExpandedTopic] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const handleDelete = async (e, topicId) => {
    e.stopPropagation()

    if (!window.confirm('Delete this topic and all its revisions?')) return

    setDeletingId(topicId)
    const { error } = await supabase.from('topics').delete().eq('id', topicId)

    if (!error) onTopicDeleted()
    setDeletingId(null)
  }

  return (
    <section className="panel data-card">
      <div className="card-header">
        <div>
          <span className="panel-kicker">Knowledge Base</span>
          <h3 className="panel-title">Tracked Topics</h3>
        </div>
        <span className="badge">{topics.length} total</span>
      </div>

      {topics.length === 0 ? (
        <div className="empty-state">
          <p className="empty-title">No topics detected</p>
          <p className="empty-copy">Add your first topic to start the revision cycle.</p>
        </div>
      ) : (
        <div className="topic-list">
          {topics.map((topic) => {
            const isExpanded = expandedTopic === topic.id
            const isDeleting = deletingId === topic.id

            return (
              <div key={topic.id} className="topic-item">
                <div
                  className="topic-row"
                  onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setExpandedTopic(isExpanded ? null : topic.id)
                    }
                  }}
                >
                  <div className="topic-summary">
                    <div>
                      <p className="topic-name">{topic.title}</p>
                      <p className="topic-date">Studied on {topic.studied_at}</p>
                    </div>
                  </div>

                  <div className="topic-actions">
                    <button
                      className="icon-button danger"
                      onClick={(e) => handleDelete(e, topic.id)}
                      disabled={isDeleting}
                      title="Delete topic"
                    >
                      {isDeleting ? '...' : 'DEL'}
                    </button>
                    <span className="topic-toggle">{isExpanded ? '-' : '+'}</span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="topic-body">
                    <p className="topic-desc">
                      {topic.description?.trim() || 'No description saved for this topic yet.'}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default TopicList
