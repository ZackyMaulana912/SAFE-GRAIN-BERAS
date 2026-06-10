import { FilePdf, Lightning } from '@phosphor-icons/react'
import StatCard from './StatCard'
import GradeChart from './GradeChart'
import { exportPDF } from '../utils/pdfExport'

export default function ResultPanel({ result, counts, resultImage, processingMs, isScanning }) {
  const hasResult = !!result

  const handlePDF = () => {
    exportPDF({ result, counts, processingMs })
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Grade Status Card */}
      <div className="rounded-2xl text-center transition-all duration-500"
           style={{
             padding: '28px 20px',
             background: '#fff',
             border: '1px solid #F0E8E0',
           }}>
        <div style={{ fontSize: 11, letterSpacing: '0.12em', color: '#BBB', marginBottom: 12, fontWeight: 500 }}>
          STATUS KELAYAKAN
        </div>

        {isScanning ? (
          <div className="flex flex-col items-center gap-3">
            <div className="skeleton" style={{ width: 160, height: 36, borderRadius: 8 }} />
            <div className="skeleton" style={{ width: 220, height: 16, borderRadius: 6 }} />
          </div>
        ) : hasResult ? (
          <>
            <div className={`font-display font-bold inline-block px-4 py-1 rounded-full mb-2 ${result.colorClass}`}
                 style={{ fontSize: 28, letterSpacing: '0.02em' }}>
              {result.grade}
            </div>
            <div style={{ fontSize: 13, color: '#888', lineHeight: 1.5 }}>
              {result.description}
            </div>
          </>
        ) : (
          <div className="font-display font-bold" style={{ fontSize: 28, color: '#E0D8D0' }}>
            —
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
        <StatCard label="Butir Utuh"   value={counts?.utuh ?? 0}        color="#7EA86A" dim={!hasResult} />
        <StatCard label="Butir Pecah"  value={counts?.pecah ?? 0}       color="#C07558" dim={!hasResult} />
        <StatCard label="Benda Asing"  value={counts?.bendaAsing ?? 0}  color="#D9534F" dim={!hasResult} />
      </div>

      {/* Analysis card */}
      <div className="rounded-2xl flex flex-col gap-4"
           style={{ padding: '20px', background: '#fff', border: '1px solid #F0E8E0' }}>
        <div className="font-display font-semibold" style={{ fontSize: 14, color: '#3D3028' }}>
          Hasil Analisis
        </div>

        {/* Donut chart */}
        <GradeChart counts={counts} result={result} />

        {/* Grade label & price */}
        {hasResult && (
          <>
            <div style={{ borderTop: '1px solid #F0E8E0', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 13, color: '#999' }}>Grade Deteksi</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${result.colorClass}`}
                      style={{ fontSize: 11, fontWeight: 700 }}>
                  {result.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ fontSize: 13, color: '#999' }}>Estimasi Jual</span>
                <span className="font-display font-bold" style={{ fontSize: 16, color: '#3D3028' }}>
                  {result.formattedPrice}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span style={{ fontSize: 11, color: '#AAA' }}>Tingkat Keutuhan</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: result.barColor }}>
                  {result.percentUtuh}%
                </span>
              </div>
              <div className="rounded-full overflow-hidden" style={{ height: 8, background: '#EEE8E2' }}>
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${result.percentUtuh}%`, background: result.barColor }}
                />
              </div>
            </div>

            {/* Processing time */}
            {processingMs && (
              <div className="flex items-center gap-1.5 rounded-lg px-3 py-2"
                   style={{ background: '#EEF4FD', fontSize: 12, color: '#1E5FA0' }}>
                <Lightning size={14} weight="fill" />
                Diproses dalam {processingMs} ms
              </div>
            )}

            {/* PDF button */}
            <button
              onClick={handlePDF}
              className="flex items-center justify-center gap-2 w-full rounded-xl font-display font-semibold transition-all duration-200"
              style={{
                padding: '11px',
                fontSize: 13,
                background: 'transparent',
                border: '1.5px solid #C28E72',
                color: '#C28E72',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#C28E72'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C28E72' }}
            >
              <FilePdf size={16} /> Download Laporan PDF
            </button>
          </>
        )}
      </div>

      {/* Result image */}
      {resultImage && (
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #F0E8E0' }}>
          <div style={{ padding: '10px 14px', fontSize: 11, color: '#AAA', background: '#FAFAF8', letterSpacing: '0.08em' }}>
            GAMBAR HASIL DETEKSI
          </div>
          <img src={resultImage} alt="Hasil deteksi" className="w-full object-contain" />
        </div>
      )}
    </div>
  )
}
