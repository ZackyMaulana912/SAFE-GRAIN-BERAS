import { ClockCounterClockwise, Trash } from '@phosphor-icons/react'

const BADGE = {
  'LOLOS QC — GRADE A':         'grade-premium',
  'LOLOS QC — GRADE B':         'grade-medium',
  'REJECT — PERLU SORTIR ULANG':'grade-low',
  'TIDAK LAYAK KONSUMSI':       'grade-dirty',
}

function fmtTime(iso) {
  try {
    const d = new Date(iso)
    return d.toLocaleString('id-ID', {
      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
    })
  } catch { return iso }
}

export default function HistoryTable({ history, loading, onClear }) {
  return (
    <section style={{ marginTop: 36 }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ClockCounterClockwise size={20} color="#3D3028" />
          <h2 className="font-display font-semibold" style={{ fontSize: 16, color: '#3D3028' }}>
            Riwayat Analisis
          </h2>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1.5 rounded-lg transition-all"
            style={{
              padding: '6px 12px',
              fontSize: 12,
              color: '#D9534F',
              background: 'transparent',
              border: '1px solid #F5CECE',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
            }}
          >
            <Trash size={13} /> Hapus Semua
          </button>
        )}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #F0E8E0' }}>
        {loading ? (
          <div className="p-6 flex flex-col gap-3">
            {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 20 }} />)}
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10" style={{ color: '#CCC' }}>
            <ClockCounterClockwise size={32} weight="light" />
            <span style={{ fontSize: 13 }}>Belum ada riwayat scan</span>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #F0E8E0' }}>
                {['Waktu', 'Grade', 'Keutuhan', 'Estimasi Harga'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#C28E72',
                    textAlign: 'left',
                    letterSpacing: '0.06em',
                    fontFamily: 'var(--font-body)',
                  }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((row, i) => (
                <tr key={row.id ?? i}
                    style={{ borderBottom: i < history.length - 1 ? '1px solid #FAF5F0' : 'none' }}>
                  <td style={{ padding: '13px 16px', fontSize: 12, color: '#888' }}>
                    {fmtTime(row.timestamp)}
                  </td>
                  <td style={{ padding: '13px 16px' }}>
                    <span className={`rounded-full px-2.5 py-1 font-semibold ${BADGE[row.label] || 'grade-medium'}`}
                          style={{ fontSize: 11 }}>
                      {row.grade}
                    </span>
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 12, color: '#666', fontWeight: 500 }}>
                    {row.percent_utuh}%
                  </td>
                  <td style={{ padding: '13px 16px', fontSize: 13, fontWeight: 700, color: '#3D3028', fontFamily: 'var(--font-display)' }}>
                    {row.estimated_price
                      ? 'Rp ' + Number(row.estimated_price).toLocaleString('id-ID')
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}
