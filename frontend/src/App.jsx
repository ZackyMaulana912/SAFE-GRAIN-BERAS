import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import UploadPanel from './components/UploadPanel'
import ResultPanel from './components/ResultPanel'
import ErrorView from './components/ErrorView'
import HistoryTable from './components/HistoryTable'
import AboutPage from './pages/AboutPage'
import StatsPage from './pages/StatsPage'
import { useDetection } from './hooks/useDetection'
import { useHistory } from './hooks/useHistory'
import { checkHealth } from './utils/api'
import { WifiX, X } from '@phosphor-icons/react'

function ServerBanner({ onDismiss }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '10px 20px',
      background: '#FFF0F0', borderBottom: '1px solid #FFCCCC',
      fontSize: 13, color: '#C0383A', gap: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <WifiX size={16} weight="fill" />
        <span>Server AI tidak terdeteksi. Jalankan <code style={{ background: '#FFDDDD', padding: '1px 6px', borderRadius: 4, fontSize: 12 }}>python app.py</code> di folder backend.</span>
      </div>
      <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C0383A', padding: 4 }}>
        <X size={14} />
      </button>
    </div>
  )
}

export default function App() {
  const [page,          setPage]          = useState('dashboard')
  const [serverOnline,  setServerOnline]  = useState(true)
  const [bannerDismiss, setBannerDismiss] = useState(false)

  const {
    image, resultImage, isScanning, isProcessed,
    result, counts, processingMs, error,
    handleImageUpload, startScan, reset,
  } = useDetection()

  const { history, loading, clear } = useHistory()

  // Health check on mount and every 30s
  useEffect(() => {
    const check = async () => {
      const ok = await checkHealth()
      setServerOnline(ok)
      if (ok) setBannerDismiss(false)
    }
    check()
    const interval = setInterval(check, 30000)
    return () => clearInterval(interval)
  }, [])

  const showBanner = !serverOnline && !bannerDismiss

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar page={page} onNav={setPage} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Server offline banner */}
        {showBanner && <ServerBanner onDismiss={() => setBannerDismiss(true)} />}

        <main style={{ flex: 1, overflowY: 'auto', padding: '36px 40px' }}>

          {/* ── Dashboard ── */}
          {page === 'dashboard' && (
            <>
              <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 26, color: '#3D3028', marginBottom: 4 }}>
                  Smart Rice Detector
                </h1>
                <p style={{ fontSize: 14, color: '#AAA' }}>
                  Deteksi kualitas beras otomatis berbasis AI Computer Vision (YOLOv8)
                </p>
              </div>

              {/* Responsive grid — stack on narrow screens */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'min(340px, 100%) 1fr',
                gap: 24,
                alignItems: 'start',
              }}>
                <UploadPanel
                  image={image}
                  isScanning={isScanning}
                  isProcessed={isProcessed}
                  onUpload={handleImageUpload}
                  onScan={startScan}
                  onReset={reset}
                />
                <div>
                  {error
                    ? <ErrorView error={error} />
                    : <ResultPanel
                        result={result}
                        counts={counts}
                        resultImage={resultImage}
                        processingMs={processingMs}
                        isScanning={isScanning}
                      />
                  }
                </div>
              </div>

              <HistoryTable history={history} loading={loading} onClear={clear} />
            </>
          )}

          {/* ── Statistik ── */}
          {page === 'stats' && (<div style={{ maxWidth: 920, margin: '0 auto' }}><StatsPage /></div>)}

          {/* ── About ── */}
          {page === 'about' && (
            <div style={{ maxWidth: 920, margin: '0 auto' }}>
              <AboutPage />
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
