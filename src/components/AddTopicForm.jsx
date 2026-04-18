import { useState } from 'react'
import { supabase } from '../supabaseClient'

function AddTopicForm({ onTopicAdded }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const {
      data: { user }
    } = await supabase.auth.getUser()

    const { error: insertError } = await supabase.from('topics').insert({
      user_id: user.id,
      title,
      description,
      studied_at: new Date().toISOString().split('T')[0]
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    setTitle('')
    setDescription('')
    onTopicAdded()
    setLoading(false)
  }

  return (
    <section className="panel data-card">
      <div className="card-header">
        <div>
          <span className="panel-kicker">New Topic</span>
          <h3 className="panel-title">Inject Study Target</h3>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="stack">
        <input
          className="input"
          type="text"
          placeholder="Topic title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="textarea"
          placeholder="Short description or memory hook"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
        {error && <p className="error-text">{error}</p>}
        <button className="action-button" type="submit" disabled={loading}>
          {loading ? 'Saving Topic...' : 'Add Topic'}
        </button>
      </form>
    </section>
  )
}

export default AddTopicForm
