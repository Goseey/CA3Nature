'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

const navLinks = [
  { href: '/events',    label: 'Events',       icon: '🎉' },
  { href: '/timetable', label: 'Timetable',    icon: '📅' },
  { href: '/map',       label: 'Map',          icon: '🗺️' },
  { href: '/lost',      label: 'Lost & Found', icon: '🔍' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <Link href="/" className="navbar-brand">
          <div className="navbar-brand-icon">🎓</div>
          <span>Campus Companion</span>
        </Link>

        {/* Nav links */}
        <ul className="navbar-nav">
          {navLinks.map(({ href, label, icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={pathname.startsWith(href) ? 'active' : ''}
              >
                <span>{icon}</span>
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="navbar-actions">
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ 
                fontSize: '0.9rem', 
                color: 'var(--text-secondary)',
                fontWeight: 500
              }}>
                👤 {user.user_metadata?.name || user.email?.split('@')[0]}
              </span>
              <button 
                onClick={handleSignOut}
                className="btn btn-outline btn-sm"
              >
                Log out
              </button>
            </div>
          ) : (
            <Link href="/login">
              <button className="btn btn-outline btn-sm">Log in</button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
