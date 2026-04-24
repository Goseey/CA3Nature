'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

interface Event {
  id: number
  title: string
  category: string
  date: string
  time: string
  description: string
  location_id: number
  locations?: { name: string }
}

const CATEGORIES = ['All', 'Social', 'Career', 'Academic', 'Wellness', 'Culture']

const CATEGORY_COLORS = {
  Social: 'badge-blue',
  Career: 'badge-purple',
  Academic: 'badge-green',
  Wellness: 'badge-orange',
  Culture: 'badge-red',
}

const CATEGORY_ICONS = {
  Social: '🎉',
  Career: '💼',
  Academic: '💻',
  Wellness: '🧠',
  Culture: '🎬',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCategory, setActive] = useState('All')
  const [selected, setSelected] = useState<Event | null>(null)

  useEffect(() => {
    supabase
      .from('events')
      .select('*, locations(name)')
      .order('date', { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error(error)
        else setEvents(data || [])
        setLoading(false)
      })
  }, [])

  const filtered = events.filter(e => {
    const loc = e.locations?.name || ''
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
                        loc.toLowerCase().includes(search.toLowerCase())
    const matchCat = activeCategory === 'All' || e.category === activeCategory
    return matchSearch && matchCat
  })

  return (
    <>
      <div className="page-header">
        <div className="container">
          <div className="page-header-badge">🎉 Campus Events</div>
          <h1>What&apos;s On Campus</h1>
          <p>Discover events, workshops, and activities happening across TUD.</p>
        </div>
      </div>

      <div className="section">
        <div className="container">
          <div style={{
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            marginBottom: '24px',
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
            <div className="search-bar" style={{ flex: 1, minWidth: '220px' }}>
              <span className="search-bar-icon">🔎</span>
              <input
                type="text"
                className="form-input"
                placeholder="Search events..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '42px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActive(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-3">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="card">
                  <div className="skeleton" style={{ height: '80px' }} />
                  <div className="card-body">
                    <div className="skeleton" style={{ height: '16px', marginBottom: '8px' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎉</div>
              <h3>No events found</h3>
            </div>
          ) : (
            <div className="grid grid-3">
              {filtered.map((event, i) => (
                <div
                  key={event.id}
                  className="card fade-in-up"
                  style={{ cursor: 'pointer', animationDelay: `${i * 0.05}s` }}
                  onClick={() => setSelected(event)}
                >
                  <div style={{
                    background: 'var(--brand-blue-pale)',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2.4rem',
                    borderBottom: '1px solid var(--border)',
                  }}>
                    {CATEGORY_ICONS[event.category as keyof typeof CATEGORY_ICONS] || '📌'}
                  </div>
                  <div className="card-body">
                    <div style={{ marginBottom: '10px' }}>
                      <span className={`badge ${CATEGORY_COLORS[event.category as keyof typeof CATEGORY_COLORS] || 'badge-gray'}`}>
                        {event.category}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1rem', marginBottom: '6px', fontFamily: 'Syne, sans-serif' }}>
                      {event.title}
                    </h3>
                    <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.5 }}>
                      {event.description?.slice(0, 90)}{event.description && event.description.length > 90 ? '…' : ''}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span>📅</span> {formatDate(event.date)} at {event.time}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span>📍</span> {event.locations?.name || '—'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '2rem' }}>
                  {CATEGORY_ICONS[selected.category as keyof typeof CATEGORY_ICONS] || '📌'}
                </span>
                <div>
                  <span className={`badge ${CATEGORY_COLORS[selected.category as keyof typeof CATEGORY_COLORS] || 'badge-gray'}`}>
                    {selected.category}
                  </span>
                  <h2 style={{ fontSize: '1.15rem', fontFamily: 'Syne, sans-serif' }}>{selected.title}</h2>
                </div>
              </div>
              <button className="modal-close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '20px' }}>
                {selected.description}
              </p>
              <div style={{
                background: 'var(--surface-2)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                marginBottom: '20px',
              }}>
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.9rem' }}>
                  <span>📅</span>
                  <span>{formatDate(selected.date)} at {selected.time}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.9rem' }}>
                  <span>📍</span>
                  <span>{selected.locations?.name || '—'}</span>
                </div>
              </div>
              <button className="btn btn-ghost" style={{ width: '100%' }} onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}