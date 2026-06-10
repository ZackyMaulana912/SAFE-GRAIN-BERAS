import { useDropzone } from 'react-dropzone'
import { useRef, useState, useCallback } from 'react'
import { Camera, ArrowClockwise, Scan, LightbulbFilament, VideoCamera, X } from '@phosphor-icons/react'

export default function UploadPanel({ image, isScanning, isProcessed, onUpload, onScan, onReset }) {
  const [price, setPrice]           = useState('')
  const [cameraOpen, setCameraOpen] = useState(false)
  const [stream, setStream]         = useState(null)
  const [cameraError, setCameraError] = useState(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    onDrop: (files) => { if (files[0]) onUpload(files[0]) },
    disabled: isScanning || cameraOpen,
  })

  // ── Camera ──────────────────────────────
  const openCamera = useCallback(async () => {
    setCameraError(null)
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 1280 } }
      })
      setStream(s)
      setCameraOpen(true)
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = s }, 100)
    } catch {
      setCameraError('Kamera tidak dapat diakses. Pastikan izin kamera diaktifkan.')
    }
  }, [])

  const closeCamera = useCallback(() => {
    if (stream) stream.getTracks().forEach(t => t.stop())
    setStream(null)
    setCameraOpen(false)
    setCameraError(null)
  }, [stream])

  const capturePhoto = useCallback(() => {
    const video  = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width  = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    canvas.toBlob(blob => {
      if (!blob) return
      const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' })
      onUpload(file)
      closeCamera()
    }, 'image/jpeg', 0.92)
  }, [onUpload, closeCamera])

  const handleScan = () => onScan(price)
  const canScan    = !!image && !isProcessed && !isScanning

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

      {/* Camera modal */}
      {cameraOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.82)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 16,
        }}>
          <video ref={videoRef} autoPlay playsInline muted
            style={{ width: '100%', maxWidth: 520, borderRadius: 16, background: '#000' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={capturePhoto} style={{
              padding: '14px 36px', borderRadius: 50,
              background: '#C28E72', color: '#fff',
              border: 'none', fontSize: 15, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'var(--font-display)',
            }}>
              📸 Ambil Foto
            </button>
            <button onClick={closeCamera} style={{
              padding: '14px 20px', borderRadius: 50,
              background: 'rgba(255,255,255,0.12)', color: '#fff',
              border: 'none', fontSize: 15, cursor: 'pointer',
            }}>
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Drop zone */}
      <div {...getRootProps()} style={{
        position: 'relative', borderRadius: 16, overflow: 'hidden',
        aspectRatio: '1/1',
        border: isDragActive ? '2px solid #C28E72' : image ? '2px solid #E0D0C4' : '2px dashed #C28E72',
        background: isDragActive ? '#FBF4EF' : '#F8F5F2',
        cursor: isScanning ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s',
      }}>
        <input {...getInputProps()} />
        {image ? (
          <img src={image} alt="Preview beras" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 10,
            color: '#C28E72',
          }}>
            <Camera size={40} weight="light" />
            <div style={{ textAlign: 'center', fontSize: 13, lineHeight: 1.6 }}>
              {isDragActive
                ? <span style={{ fontWeight: 600 }}>Lepaskan gambar di sini</span>
                : <><span style={{ fontWeight: 600 }}>Klik atau seret gambar</span><br />
                   <span style={{ color: '#B0A098', fontSize: 12 }}>JPEG / PNG · disarankan 640×640</span></>
              }
            </div>
          </div>
        )}
        {isDragActive && (
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 16,
            background: 'rgba(194,142,114,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#C28E72', fontWeight: 600, fontSize: 15 }}>Lepaskan untuk upload</span>
          </div>
        )}
      </div>

      {/* Camera button */}
      {!image && (
        <button onClick={openCamera} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          width: '100%', padding: '11px', borderRadius: 12,
          border: '1.5px solid #C28E72', background: 'transparent',
          color: '#C28E72', fontSize: 13, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'var(--font-body)',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#C28E72'; e.currentTarget.style.color = '#fff' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C28E72' }}
        >
          <VideoCamera size={16} /> Gunakan Kamera
        </button>
      )}

      {cameraError && (
        <div style={{ fontSize: 12, color: '#D9534F', background: '#FFF0F0', borderRadius: 8, padding: '8px 12px' }}>
          {cameraError}
        </div>
      )}

      {/* Tip */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, borderRadius: 10, padding: '10px 12px', background: '#FFF8E7', fontSize: 12, color: '#B07A28' }}>
        <LightbulbFilament size={15} weight="fill" color="#F59E0B" style={{ flexShrink: 0, marginTop: 1 }} />
        <span>Gunakan latar belakang gelap (kain hitam) agar deteksi lebih akurat.</span>
      </div>

      {/* Price */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#3D3028' }}>Harga Pasar (Rp)</label>
        <input type="number" value={price} onChange={e => setPrice(e.target.value)}
          placeholder="Contoh: 15000" disabled={isScanning}
          style={{
            padding: '11px 14px', border: '1.5px solid #DDD0C8',
            borderRadius: 12, fontFamily: 'var(--font-body)', fontSize: 14,
            background: '#fff', color: '#1E1E1E', outline: 'none', transition: 'all 0.15s',
          }}
          onFocus={e => { e.target.style.borderColor = '#C28E72'; e.target.style.boxShadow = '0 0 0 3px rgba(194,142,114,0.12)' }}
          onBlur={e => { e.target.style.borderColor = '#DDD0C8'; e.target.style.boxShadow = 'none' }}
        />
        <span style={{ fontSize: 11, color: '#AAA' }}>Harga dasar sebelum penyesuaian mutu.</span>
      </div>

      {/* Scan button */}
      <button onClick={handleScan} disabled={!canScan} style={{
        width: '100%', padding: '15px', borderRadius: 12, border: 'none',
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16,
        letterSpacing: '0.02em', cursor: canScan ? 'pointer' : 'not-allowed',
        background: canScan ? '#C28E72' : '#D1CCC8', color: '#fff',
        animation: canScan ? 'pulse-ring 1.8s ease-out infinite' : 'none',
        transition: 'background 0.2s',
      }}>
        {isScanning ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <span style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
            Memproses AI...
          </span>
        ) : isProcessed ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Scan size={18} /> Selesai
          </span>
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Scan size={18} /> Scan Beras
          </span>
        )}
      </button>

      {image && (
        <button onClick={() => { onReset(); setPrice('') }} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          width: '100%', padding: '9px', borderRadius: 12,
          border: '1px solid #E8E0D8', background: 'transparent',
          color: '#AAA', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)',
          transition: 'all 0.15s',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = '#666'; e.currentTarget.style.borderColor = '#C8BAB0' }}
          onMouseLeave={e => { e.currentTarget.style.color = '#AAA'; e.currentTarget.style.borderColor = '#E8E0D8' }}
        >
          <ArrowClockwise size={14} /> Reset
        </button>
      )}
    </div>
  )
}
