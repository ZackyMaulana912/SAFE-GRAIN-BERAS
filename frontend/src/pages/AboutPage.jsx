import { Eye, Code, ChartBar, Cpu, Stack, FilePdf, UsersThree } from '@phosphor-icons/react'

const teams = [
  {
    role: 'AI Engineer',
    members: ['Andy Bagus Oesmadi', 'Zacky Maulana'],
  },
  {
    role: 'UI/UX & Front-End, Back-End',
    members: ['Venerdi Dinarsa Narendra Putra C.', 'Vlahadiqa Runayasha Khandeva W.'],
  },
]

const stack = [
  { label: 'Model AI', value: 'YOLOv8 · Ultralytics', Icon: Cpu },
  { label: 'Backend', value: 'Python · FastAPI · SQLAlchemy', Icon: Stack },
  { label: 'Frontend', value: 'React 18 · Vite · Tailwind CSS', Icon: Code },
  { label: 'PDF Export', value: 'jsPDF', Icon: FilePdf },
]

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 0 }}>

      {/* Page Header */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700, fontSize: 26,
          color: '#3D3028', marginBottom: 6,
        }}>
          About Safe Grain
        </h1>
        <p style={{ fontSize: 14, color: '#999' }}>
          Informasi Tim Pengembang &amp; Teknologi Proyek
        </p>
      </div>

      {/* Hero — centered */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{
          width: 80, height: 80, borderRadius: 24,
          background: '#FAF0E8',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <UsersThree size={40} weight="duotone" color="#C28E72" />
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 700, fontSize: 22,
          color: '#3D3028', marginBottom: 12,
        }}>
          Team Project Kecerdasan Buatan (AI)
        </h2>
        <p style={{
          fontSize: 14, color: '#888',
          lineHeight: 1.8, maxWidth: 600,
          margin: '0 auto',
        }}>
          Proyek ini dikembangkan sebagai implementasi Tugas Besar Mata Kuliah Kecerdasan Buatan
          (Artificial Intelligent). Kami mengeksplorasi penerapan Computer Vision untuk membantu
          proses kendali mutu pangan sederhana.
        </p>
      </div>

      {/* Tech Stack */}
      <div style={{ marginBottom: 48 }}>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 600,
          fontSize: 13, color: '#BBB',
          letterSpacing: '0.1em', marginBottom: 16,
        }}>
          TEKNOLOGI
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {stack.map(({ label, value, Icon }) => (
            <div key={label} style={{
              background: '#fff',
              border: '1px solid #F0E8E0',
              borderRadius: 14,
              padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: 14,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 11,
                background: '#FAF0E8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={20} weight="duotone" color="#C28E72" />
              </div>
              <div>
                <div style={{ fontSize: 10, color: '#CCC', fontWeight: 600, letterSpacing: '0.08em', marginBottom: 4 }}>
                  {label.toUpperCase()}
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#444' }}>{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Teams — 3 kolom lebar, mirip referensi */}
      <div>
        <div style={{
          fontFamily: 'var(--font-display)', fontWeight: 600,
          fontSize: 13, color: '#BBB',
          letterSpacing: '0.1em', marginBottom: 16,
        }}>
          TIM PENGEMBANG
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {teams.map(({ role, members }) => (
            <div key={role} style={{
              background: '#fff',
              border: '1px solid #F0E8E0',
              borderRadius: 16,
              padding: '24px 22px',
            }}>
              {/* Role title — inline dengan icon kecil */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                marginBottom: 18,
                paddingBottom: 14,
                borderBottom: '1px solid #F5EEE8',
              }}>
                <span style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700, fontSize: 14,
                  color: '#3D3028',
                }}>
                  {role}
                </span>
              </div>

              {/* Members list — persis seperti referensi */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {members.map(m => (
                  <li key={m} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    fontSize: 13, color: '#555', lineHeight: 1.4,
                  }}>
                    <span style={{
                      width: 7, height: 7,
                      borderRadius: '50%',
                      background: '#C28E72',
                      flexShrink: 0,
                    }} />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
