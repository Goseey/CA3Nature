'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

interface TimetableEntry {
  id: number
  subject: string
  day: string
  time: string
  location_id: number | null
  user_id: string
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default function TimetablePage() {
  const { user } = useAuth()
  const router = useRouter()
  const [entries, setEntries] = useState<TimetableEntry[]>([])
  const [selectedDay, setSelectedDay] = useState('Monday')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [form, setForm] = useState({
    subject: '',
    day: 'Monday',
    time: '09:00'
  })

  useEffect(() => {
    if (user) {
      loadTimetable()
    }
  }, [user])

  const loadTimetable = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('timetable')
      .select('*')
      .eq('user_id', user.id)
      .order('time', { ascending: true })
    
    if (data) setEntries(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      alert('Please log in to add classes')
      router.push('/login')
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from('timetable')
      .insert([{
        subject: form.subject,
        day: form.day,
        time: form.time,
        user_id: user.id
      }])

    if (error) {
      alert('Error: ' + error.message)
    } else {
      setForm({ subject: '', day: 'Monday', time: '09:00' })
      setShowForm(false)
      loadTimetable()
    }
    
    setLoading(false)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this class?')) return

    const { error } = await supabase
      .from('timetable')
      .delete()
      .eq('id', id)

    if (!error) loadTimetable()
  }

  if (!user) {
    return (
      <div style={{ 
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '48px',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📅</div>
          <h2 style={{ marginBottom: '12px', fontFamily: 'Syne, sans-serif' }}>
            Login Required
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
            Please log in to view your personal timetable
          </p>
          <button onClick={() => router.push('/login')} className="btn-primary">
            Log in
          </button>
        </div>
      </div>
    )
  }

  const todayEntries = entries.filter(e => e.day === selectedDay)

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
          📅 Timetable
        </div>

        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '2.5rem',
          fontWeight: 700,
          color: 'white',
          marginBottom: '12px'
        }}>
          Your Class Schedule
        </h1>
        
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.05rem', marginBottom: '32px' }}>
          All your lectures and labs — week at a glance.
        </p>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {DAYS.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: 'none',
                background: selectedDay === day ? 'white' : 'rgba(255,255,255,0.2)',
                color: selectedDay === day ? 'var(--brand-purple)' : 'white',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {day.slice(0, 3)}
            </button>
          ))}
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
            style={{ marginLeft: 'auto' }}
          >
            + Add Class
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
            <h3 style={{ marginBottom: '20px', fontFamily: 'Syne, sans-serif' }}>Add Class</h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Subject *</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({...form, subject: e.target.value})}
                placeholder="e.g., Web Development"
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
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Day *</label>
              <select
                value={form.day}
                onChange={(e) => setForm({...form, day: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border)'
                }}
              >
                {DAYS.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Time *</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({...form, time: e.target.value})}
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
                {loading ? 'Adding...' : 'Add Class'}
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {todayEntries.length === 0 ? (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '48px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
              <p style={{ color: 'var(--text-muted)' }}>No classes scheduled for {selectedDay}</p>
            </div>
          ) : (
            todayEntries.map(entry => (
              <div key={entry.id} style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)',
                  color: 'white',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  minWidth: '80px',
                  textAlign: 'center',
                  fontWeight: 600
                }}>
                  {entry.time}
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: 700,
                    marginBottom: '4px',
                    color: 'var(--text-primary)'
                  }}>
                    {entry.subject}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {selectedDay}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(entry.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#EF4444',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    padding: '8px'
                  }}
                  title="Delete class"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>

        <div style={{ 
          marginTop: '32px',
          background: 'white',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <h3 style={{ 
            fontFamily: 'Syne, sans-serif',
            marginBottom: '16px',
            fontSize: '1.2rem'
          }}>
            All Subjects This Week
          </h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {Array.from(new Set(entries.map(e => e.subject))).map(subject => (
              <span
                key={subject}
                style={{
                  background: 'var(--surface-2)',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  color: 'var(--text-secondary)'
                }}
              >
                {subject}
              </span>
            ))}
            {entries.length === 0 && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No classes added yet. Click "+ Add Class" to get started!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}