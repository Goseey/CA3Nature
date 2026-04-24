import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import { AuthProvider } from '@/lib/auth-context'

export const metadata: Metadata = {
  title: 'Campus Companion: Life Hub',
  description: 'Your all-in-one campus management platform — Events, Timetable, Map, and Lost & Found.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AuthProvider>
          <div className="page-wrapper">
            <Navbar />
            <main className="main-content">
              {children}
            </main>
          <footer style={{
            background: 'white',
            borderTop: '1px solid var(--border)',
            padding: '24px 0',
            marginTop: 'auto',
          }}>
            <div className="container" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  background: 'var(--brand-blue)',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.9rem',
                }}>🎓</div>
                <span style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: 'var(--brand-blue)',
                }}>Campus Companion</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                © {new Date().getFullYear()} Campus Companion: Life Hub. Built for TUD students.
              </p>
            </div>
          </footer>
        </div>
        </AuthProvider>
      </body>
    </html>
  )
}
