import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

export default function GradeChart({ counts, result }) {
  if (!counts || !result) {
    return (
      <div className="flex items-center justify-center rounded-2xl"
           style={{ height: 160, background: '#F5F2EF' }}>
        <span style={{ fontSize: 12, color: '#BBB' }}>Scan untuk melihat hasil</span>
      </div>
    )
  }

  const { utuh, pecah, bendaAsing } = counts
  const data = [
    { name: 'Utuh',         value: utuh,       color: '#7EA86A' },
    { name: 'Pecah',        value: pecah,       color: '#C07558' },
    { name: 'Benda Asing',  value: bendaAsing,  color: '#D9534F' },
  ].filter(d => d.value > 0)

  const total = utuh + pecah

  return (
    <div className="flex items-center gap-4">
      <div style={{ width: 140, height: 140, flexShrink: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="50%"
              innerRadius={44}
              outerRadius={66}
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div style={{ marginTop: -76, textAlign: 'center', pointerEvents: 'none' }}>
          <div className="font-display font-bold" style={{ fontSize: 22, color: result.barColor, lineHeight: 1 }}>
            {result.percentUtuh}%
          </div>
          <div style={{ fontSize: 10, color: '#AAA', marginTop: 2 }}>utuh</div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2 flex-1">
        {[
          { label: 'Butir utuh',    value: utuh,       color: '#7EA86A' },
          { label: 'Butir pecah',   value: pecah,       color: '#C07558' },
          ...(bendaAsing > 0 ? [{ label: 'Benda asing', value: bendaAsing, color: '#D9534F' }] : []),
        ].map(({ label, value, color }) => (
          <div key={label} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <div className="rounded-full flex-shrink-0" style={{ width: 8, height: 8, background: color }} />
              <span style={{ fontSize: 12, color: '#666' }}>{label}</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#333' }}>{value}</span>
          </div>
        ))}
        <div className="flex items-center justify-between gap-2" style={{ paddingTop: 4, borderTop: '1px solid #EEE' }}>
          <span style={{ fontSize: 12, color: '#AAA' }}>Total terdeteksi</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#333' }}>{total + bendaAsing}</span>
        </div>
      </div>
    </div>
  )
}
