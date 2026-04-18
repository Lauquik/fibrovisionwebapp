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

    // Get current logged in user
    const { data: { user } } = await supabase.auth.getUser()

    const { error } = await supabase.from('topics').insert({
      user_id: user.id,
      title,
      description,
      studied_at: new Date().toISOString().split('T')[0] // today's date
    })

    if (error) {
      setError(error.message)
    } else {
      setTitle('')
      setDescription('')
      onTopicAdded() // refresh parent
    }

    setLoading(false)
  }

  return (
    <div style={styles.card}>
      <h3>Add New Topic</h3>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="Topic title (e.g. Photosynthesis)"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          style={{ ...styles.input, resize: 'vertical'}}
          placeholder="Short description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? 'Adding...' : '+ Add Topic'}
        </button>
      </form>
    </div>
  )
}

const styles = {
  card: { background: '#f9fafb', padding: 20, borderRadius: 10, marginBottom: 24, border: '1px solid #e5e7eb' },
  form: { display: 'flex', flexDirection: 'column', gap: 10 },
  input: { padding: '10px', fontSize: 15, borderRadius: 6, background: '#ffffff', border: '1px solid #181313', fontFamily: 'sans-serif', color: 'black' },
  button: { padding: '10px', fontSize: 15, borderRadius: 6, background: '#4f46e5', color: '#eadddd', border: 'none', cursor: 'pointer' },
  error: { color: 'red', fontSize: 13 }
}

export default AddTopicForm