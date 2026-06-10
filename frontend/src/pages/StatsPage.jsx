import { useEffect, useState } from 'react'
import { fetchStats, fetchHistory } from '../utils/api'
import { ChartBar, CheckCircle, Scales, Timer, Grains } from '@phosphor-icons/react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts'

function StatSummaryCard({ icon: Icon, label, value, sub, color, bg }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #F0E8E0', borderRadius: 16,
      padding: '20px', display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{ width: 48, height: 48, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={24} weight="duotone" color={color} />
      </div>
      <div>
        <div style={{ fontSize: 11, color: '#BBB', letterSpacing: '0.07em', marginBottom: 4 }}>{label.toUpperCase()}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 24, color: '#3D3028', lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: '#AAA', marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  )
}

const GRADE_COLORS = {
  'PREMIUM':      '#7EA86A',
  'MEDIUM':       '#C07558',
  'LOW':          '#D9534F',
  'TIDAK BERSIH': '#8B2020',
}

const GRADE_BG = {
  'PREMIUM':      '#EDF5E9',
  'MEDIUM':       '#FBF0EB',
  'LOW':          '#FBEBEB',
  'TIDAK BERSIH': '#F5E0E0',
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#fff', border: '1px solid #F0E8E0',
      borderRadius: 10, padding: '10px 14px', fontSize: 12,
    }}>
      <div style={{ fontWeight: 600, color: '#3D3028', marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}{p.name === 'Keutuhan' ? '%' : ''}</div>
      ))}
    </div>
  )
}

export default function StatsPage() {
  const [stats,   setStats]   = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchStats(), fetchHistory(50)])
      .then(([s, h]) => {
        setStats(s)
        setHistory((h.items || []).reverse())
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {[1,2,3].map(i => (
        <div key={i} className="skeleton" style={{ height: 80, borderRadius: 16 }} />
      ))}
    </div>
  )

  if (!stats) return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: '#BBB', fontSize: 14 }}>
      Tidak dapat memuat statistik. Pastikan backend berjalan.
    </div>
  )

  // Process history for charts
  const trendData = history.slice(-20).map((h, i) => ({
    label: `#${i + 1}`,
    Keutuhan: h.percent_utuh,
    Utuh: h.utuh,
    Pecah: h.pecah,
  }))

  const gradeData = Object.entries(stats.grade_distribution || {}).map(([name, value]) => ({
    name, value, color: GRADE_COLORS[name] || '#CCC',
  }))

  const topGrade = gradeData.sort((a, b) => b.value - a.value)[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* Header */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: '#3D3028', marginBottom: 6 }}>
          Statistik
        </h1>
        <p style={{ fontSize: 14, color: '#AAA' }}>Ringkasan seluruh riwayat analisis beras</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <StatSummaryCard
          icon={Grains} label="Total Scan"
          value={stats.total_scans}
          sub="seluruh analisis tercatat"
          color="#C28E72" bg="#FAF0E8"
        />
        <StatSummaryCard
          icon={Scales} label="Rata-rata Keutuhan"
          value={`${stats.avg_percent_utuh}%`}
          sub="rerata tingkat butir utuh"
          color="#7EA86A" bg="#EDF5E9"
        />
        <StatSummaryCard
          icon={CheckCircle} label="Grade Terbanyak"
          value={topGrade?.name || '—'}
          sub={topGrade ? `${topGrade.value}x terdeteksi` : 'belum ada data'}
          color={GRADE_COLORS[topGrade?.name] || '#CCC'}
          bg={GRADE_BG[topGrade?.name] || '#F5F5F5'}
        />
      </div>

      {/* Trend chart */}
      {trendData.length > 0 && (
        <div style={{ background: '#fff', border: '1px solid #F0E8E0', borderRadius: 16, padding: '20px 20px 12px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: '#3D3028', marginBottom: 16 }}>
            Tren Tingkat Keutuhan
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trendData} margin={{ top: 4, right: 10, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="keutuhanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#C28E72" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#C28E72" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#F5EDE6" strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#BBB' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#BBB' }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="Keutuhan" stroke="#C28E72" strokeWidth={2}
                fill="url(#keutuhanGrad)" dot={{ r: 3, fill: '#C28E72', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bottom row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

        {/* Grade distribution pie */}
        {gradeData.length > 0 && (
          <div style={{ background: '#fff', border: '1px solid #F0E8E0', borderRadius: 16, padding: '20px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: '#3D3028', marginBottom: 16 }}>
              Distribusi Grade
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <ResponsiveContainer width={130} height={130}>
                <PieChart>
                  <Pie data={gradeData} cx="50%" cy="50%" innerRadius={36} outerRadius={58}
                    paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}
                    animationBegin={0} animationDuration={700}>
                    {gradeData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                {gradeData.map(({ name, value, color }) => (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: '#666' }}>{name}</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#333' }}>{value}×</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Utuh vs Pecah bar chart */}
        {trendData.length > 0 && (
          <div style={{ background: '#fff', border: '1px solid #F0E8E0', borderRadius: 16, padding: '20px 20px 12px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: '#3D3028', marginBottom: 16 }}>
              Utuh vs Pecah per Scan
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={trendData.slice(-10)} margin={{ top: 0, right: 0, bottom: 0, left: -24 }} barSize={8}>
                <CartesianGrid stroke="#F5EDE6" strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#CCC' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#CCC' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#999' }} />
                <Bar dataKey="Utuh"  fill="#7EA86A" radius={[3,3,0,0]} />
                <Bar dataKey="Pecah" fill="#C07558" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Empty state */}
        {trendData.length === 0 && (
          <div style={{
            gridColumn: '1 / -1', textAlign: 'center', padding: '40px',
            background: '#fff', border: '1px solid #F0E8E0', borderRadius: 16,
            color: '#CCC', fontSize: 14,
          }}>
            <ChartBar size={36} weight="light" style={{ marginBottom: 8 }} />
            <div>Belum ada data scan untuk ditampilkan.</div>
          </div>
        )}
      </div>
    </div>
  )
}
