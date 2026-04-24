'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

interface LostItem {
  id: number
  title: string
  description: string | null
  status: 'lost' | 'found'
  location_id: number | null
  date: string
  user_id: string | null
}

export default function LostFoundPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [items, setItems] = useState<LostItem[]>([])
  const [filter, setFilter] = useState<'all' | 'lost' | 'found'>('all')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'lost' as 'lost' | 'found',
    date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    const { data, error } = await supabase
      .from('lost_found')
      .select('*')
      .order('date', { ascending: false })
    
    if (data) setItems(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      alert('Please log in to submit an item')
      router.push('/login')
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from('lost_found')
      .insert([{
        title: form.title,
        description: form.description,
        status: form.status,
        date: form.date,
        user_id: user.id
      }])

    if (error) {
      alert('Error: ' + error.message)
    } else {
      setForm({ title: '', description: '', status: 'lost', date: new Date().toISOString().split('T')[0] })
      setShowForm(false)
      loadItems()
    }
    
    setLoading(false)
  }

  const filteredItems = items.filter(item => 
    filter === 'all' ? true : item.status === filter
  )

  return (
    <div style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)', minHeight: 'calc(100vh - 64px)' }}>
      <div className="container" style={{ paddingTop: '48px', paddingBottom: '64px' }}>
        <div style={{ 
          display: 'inline-block',
          background: 'rgba(255,255,255,0.2)',
          padding: '6px 16px',
          borderRadius: '20px',
          marginBottom: '16px',
          backdropFilter: 'blur(10px)',
          fontSize: '0.9rem',
          color: 'white',
          fontWeight: 600
        }}>
          🔍 Lost & Found
        </div>

        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '2.5rem',
          fontWeight: 700,
          color: 'white',
          marginBottom: '12px'
        }}>
          Lost & Found Board
        </h1>
        
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.05rem', marginBottom: '32px' }}>
          Report lost items or help reunite found belongings with their owners.
        </p>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: filter === 'all' ? 'white' : 'rgba(255,255,255,0.2)',
              color: filter === 'all' ? 'var(--brand-purple)' : 'white',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            All Items
          </button>
          <button
            onClick={() => setFilter('lost')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: filter === 'lost' ? 'white' : 'rgba(255,255,255,0.2)',
              color: filter === 'lost' ? 'var(--brand-purple)' : 'white',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Lost
          </button>
          <button
            onClick={() => setFilter('found')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: filter === 'found' ? 'white' : 'rgba(255,255,255,0.2)',
              color: filter === 'found' ? 'var(--brand-purple)' : 'white',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Found
          </button>
          
          <button
            onClick={() => {
              if (!user) {
                router.push('/login')
              } else {
                setShowForm(!showForm)
              }
            }}
            className="btn-primary"
            style={{ marginLeft: 'auto' }}
          >
            + Submit Item
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '32px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ marginBottom: '20px', fontFamily: 'Syne, sans-serif' }}>Submit Item</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({...form, status: e.target.value as 'lost' | 'found'})}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)'
                }}
              >
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Item Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({...form, title: e.target.value})}
                placeholder="e.g., Blue Water Bottle"
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({...form, description: e.target.value})}
                placeholder="Provide details to help identify the item..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({...form, date: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {filteredItems.map(item => (
            <div key={item.id} style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <div style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '6px',
                background: item.status === 'lost' ? '#FEF3C7' : '#D1FAE5',
                color: item.status === 'lost' ? '#92400E' : '#065F46',
                fontSize: '0.75rem',
                fontWeight: 600,
                marginBottom: '12px'
              }}>
                {item.status === 'lost' ? '🔴 LOST' : '🟢 FOUND'}
              </div>

              <h3 style={{ 
                fontSize: '1.1rem', 
                fontWeight: 700,
                marginBottom: '8px',
                color: 'var(--text-primary)'
              }}>
                {item.title}
              </h3>

              {item.description && (
                <p style={{ 
                  color: 'var(--text-secondary)', 
                  fontSize: '0.9rem',
                  marginBottom: '12px',
                  lineHeight: '1.5'
                }}>
                  {item.description}
                </p>
              )}

              <div style={{ 
                fontSize: '0.85rem', 
                color: 'var(--text-muted)',
                borderTop: '1px solid var(--border)',
                paddingTop: '12px'
              }}>
                📅 {new Date(item.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '48px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
            <p style={{ color: 'var(--text-muted)' }}>No items found</p>
          </div>
        )}
      </div>
    </div>
  )
}