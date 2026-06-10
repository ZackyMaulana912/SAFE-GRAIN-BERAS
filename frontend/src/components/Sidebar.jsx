import { SquaresFour, ChartBar, Info } from '@phosphor-icons/react'

const nav = [
  { id: 'dashboard', label: 'Dashboard', Icon: SquaresFour },
  { id: 'stats',     label: 'Statistik', Icon: ChartBar },
  { id: 'about',     label: 'About Us',  Icon: Info },
]

export default function Sidebar({ page, onNav }) {
  return (
    <aside style={{
      width: 220, flexShrink: 0,
      background: 'var(--color-sidebar)',
      height: '100vh',
      display: 'flex', flexDirection: 'column',
      padding: '32px 16px 24px',
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 0, marginBottom: 36,
      }}>
        <img
          src="/logo.png"
          alt="Safe Grain Logo"
          style={{
            width: 90, height: 90,
            borderRadius: '50%',
            objectFit: 'cover',
            objectPosition: 'center',
            border: '2px solid rgba(194,142,114,0.3)',
          }}
        />
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {nav.map(({ id, label, Icon }) => {
          const active = page === id
          return (
            <button key={id} onClick={() => onNav(id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '11px 14px', borderRadius: 12,
              border: 'none', cursor: 'pointer',
              fontFamily: 'var(--font-body)', fontSize: 14,
              fontWeight: active ? 600 : 400,
              background: active ? 'rgba(194,142,114,0.22)' : 'transparent',
              color: active ? '#F5E8DF' : 'rgba(255,255,255,0.50)',
              textAlign: 'left', transition: 'all 0.15s ease',
              borderLeft: active ? '3px solid #C28E72' : '3px solid transparent',
            }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
            >
              <Icon size={18} weight={active ? 'fill' : 'regular'} />
              {label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
