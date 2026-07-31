import { Link } from 'react-router-dom'
import { FiGithub, FiTwitter, FiInstagram, FiLinkedin, FiMail } from 'react-icons/fi'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function Footer() {
  const [email, setEmail] = useState('')

  const handleNewsletter = (e) => {
    e.preventDefault()
    if (email) { toast.success('Subscribed! Welcome to MOVEMATE.'); setEmail('') }
  }

  return (
    <footer style={{
      background: 'var(--dark2)',
      borderTop: '1px solid var(--border)',
      paddingTop: 60,
      paddingBottom: 30,
    }}>
      <div className="container" style={{ maxWidth: 1200 }}>
        <div className="row g-4 mb-5">
          {/* Brand */}
          <div className="col-lg-4">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40,
                background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: '1.2rem', color: '#fff', fontFamily: 'Space Grotesk, sans-serif'
              }}>M</div>
              <span style={{
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800, fontSize: '1.2rem',
                background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
              }}>MOVEMATE</span>
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 24 }}>
              Find Homes. Find Roommates. Move Smarter.<br />
              Your complete platform for seamless relocation.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[FiGithub, FiTwitter, FiInstagram, FiLinkedin].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: 38, height: 38,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border)',
                  borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-muted)', transition: 'var(--transition)'
                }}
                  onMouseOver={e => { e.currentTarget.style.background = 'rgba(108,99,255,0.2)'; e.currentTarget.style.color = 'var(--primary-light)' }}
                  onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-muted)' }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-lg-2">
            <h6 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Platform</h6>
            {[
              ['Accommodation', '/accommodation'],
              ['Roommates', '/roommates'],
              ['Travel Planner', '/travel'],
              ['Explore City', '/explore'],
              ['Local Guides', '/guides'],
              ['Dashboard', '/dashboard'],
            ].map(([label, to]) => (
              <Link key={to} to={to} style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 10, transition: 'var(--transition)' }}
                onMouseOver={e => e.target.style.color = 'var(--primary-light)'}
                onMouseOut={e => e.target.style.color = 'var(--text-muted)'}
              >{label}</Link>
            ))}
          </div>

          {/* Company */}
          <div className="col-6 col-lg-2">
            <h6 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Company</h6>
            {[
              ['About Us', '#'], ['Contact', '#'], ['Blog', '#'],
              ['Privacy Policy', '#'], ['Terms of Service', '#'], ['FAQ', '#']
            ].map(([label, to]) => (
              <a key={label} href={to} style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 10, transition: 'var(--transition)' }}
                onMouseOver={e => e.target.style.color = 'var(--primary-light)'}
                onMouseOut={e => e.target.style.color = 'var(--text-muted)'}
              >{label}</a>
            ))}
          </div>

          {/* Newsletter */}
          <div className="col-lg-4">
            <h6 style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 12, color: 'var(--text-primary)', fontSize: '0.9rem' }}>Stay in the Loop</h6>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: 16 }}>
              Get the latest listings, tips, and moving resources.
            </p>
            <form onSubmit={handleNewsletter} style={{ display: 'flex', gap: 8 }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="mm-input"
                style={{ flex: 1, fontSize: '0.85rem', padding: '10px 14px' }}
                required
              />
              <button type="submit" className="btn-primary-mm" style={{ padding: '10px 18px', fontSize: '0.85rem', flexShrink: 0 }}>
                <FiMail size={14} />
              </button>
            </form>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>
            © 2025 MOVEMATE. All rights reserved.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>
            Built with ❤️ for smart movers
          </p>
        </div>
      </div>
    </footer>
  )
}
