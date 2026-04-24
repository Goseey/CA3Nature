'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [form, setForm] = useState({ email: '', password: '', confirm: '', name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError('')

    if (!form.email || !form.password) {
      setError('Please fill in all required fields.')
      return
    }

    if (mode === 'register') {
      if (!form.name) { setError('Please enter your name.'); return }
      if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
      if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    }

    setLoading(true)

    // Simulate API call — replace with Supabase auth
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)

    // On success, redirect to homepage
    // router.push('/')
    alert(mode === 'login' ? 'Login successful! (demo)' : 'Account created! (demo)')
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--brand-blue-pale) 0%, #F0F9FF 50%, #F5F3FF 100%)',
      padding: '40px 20px',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'fixed', top: '80px', left: '-100px',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(0,61,165,0.08) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '80px', right: '-100px',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none',
      }} />

      <div style={{
        background: 'white',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-lg)',
        width: '100%',
        maxWidth: '440px',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Top decoration */}
        <div style={{
          background: 'linear-gradient(135deg, var(--brand-blue) 0%, #2563EB 100%)',
          padding: '32px 32px 28px',
          textAlign: 'center',
        }}>
          <div style={{
            width: '56px', height: '56px',
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem', margin: '0 auto 16px',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}>
            🎓
          </div>
          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontSize: '1.4rem',
            color: 'white', marginBottom: '4px',
          }}>
            Campus Companion
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem' }}>
            {mode === 'login' ? 'Welcome back, sign in to continue' : 'Create your student account'}
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border)',
        }}>
          <button
            onClick={() => { setMode('login'); setError('') }}
            style={{
              flex: 1, padding: '14px',
              background: mode === 'login' ? 'white' : 'var(--surface-2)',
              border: 'none', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
              fontSize: '0.9rem',
              color: mode === 'login' ? 'var(--brand-blue)' : 'var(--text-secondary)',
              borderBottom: mode === 'login' ? '2px solid var(--brand-blue)' : '2px solid transparent',
              transition: 'all 0.18s',
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('register'); setError('') }}
            style={{
              flex: 1, padding: '14px',
              background: mode === 'register' ? 'white' : 'var(--surface-2)',
              border: 'none', cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif', fontWeight: 600,
              fontSize: '0.9rem',
              color: mode === 'register' ? 'var(--brand-blue)' : 'var(--text-secondary)',
              borderBottom: mode === 'register' ? '2px solid var(--brand-blue)' : '2px solid transparent',
              transition: 'all 0.18s',
            }}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: '28px 32px 32px' }}>
          {error && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FECACA',
              borderRadius: 'var(--radius-sm)', padding: '10px 14px',
              marginBottom: '16px', color: '#DC2626', fontSize: '0.875rem',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  autoComplete="name"
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">TUD Email *</label>
              <input
                className="form-input"
                type="email"
                placeholder="yourname@mytudublin.ie"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Password *
                {mode === 'login' && (
                  <span style={{ fontWeight: 400, fontSize: '0.8rem', color: 'var(--brand-blue)', cursor: 'pointer' }}>
                    Forgot password?
                  </span>
                )}
              </label>
              <input
                className="form-input"
                type="password"
                placeholder={mode === 'register' ? 'At least 6 characters' : 'Enter your password'}
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">Confirm Password *</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                  autoComplete="new-password"
                />
              </div>
            )}
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '24px', padding: '13px', fontSize: '0.95rem' }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? '⏳ Please wait...'
              : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>

          {mode === 'login' && (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                margin: '20px 0', color: 'var(--text-muted)', fontSize: '0.8rem',
              }}>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                <span>or continue with</span>
                <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              </div>

              <button style={{
                width: '100%', padding: '12px',
                border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                background: 'white',
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif', fontWeight: 600, fontSize: '0.9rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                transition: 'border-color 0.18s',
              }}>
                <span>🎓</span> Sign in with TUD SSO
              </button>
            </>
          )}

          <p style={{
            textAlign: 'center', marginTop: '20px',
            fontSize: '0.83rem', color: 'var(--text-muted)',
          }}>
            {mode === 'login'
              ? <>Don&apos;t have an account?{' '}
                  <span onClick={() => setMode('register')} style={{ color: 'var(--brand-blue)', fontWeight: 600, cursor: 'pointer' }}>
                    Register here
                  </span>
                </>
              : <>Already have an account?{' '}
                  <span onClick={() => setMode('login')} style={{ color: 'var(--brand-blue)', fontWeight: 600, cursor: 'pointer' }}>
                    Sign in
                  </span>
                </>
            }
          </p>
        </div>
      </div>

      <div style={{
        textAlign: 'center', marginTop: '20px',
        fontSize: '0.75rem', color: 'var(--text-muted)',
        position: 'relative', zIndex: 1,
      }}>
        <Link href="/" style={{ color: 'var(--brand-blue)', fontWeight: 500 }}>← Back to Campus Companion</Link>
      </div>
    </div>
  )
}
