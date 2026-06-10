import { WarningCircle, WifiX } from '@phosphor-icons/react'

export default function ErrorView({ error }) {
  const isConnection = error === 'connection_error' || (typeof error === 'string' && error.includes('fetch'))

  return (
    <div className="rounded-2xl flex flex-col items-center justify-center text-center gap-3"
         style={{
           padding: '40px 24px',
           background: '#FFF8F8',
           border: '1.5px dashed #F0A0A0',
           minHeight: 200,
         }}>
      {isConnection
        ? <WifiX size={44} weight="light" color="#D9534F" />
        : <WarningCircle size={44} weight="light" color="#D9534F" />
      }

      <div className="font-display font-semibold" style={{ fontSize: 16, color: '#C0383A' }}>
        {isConnection ? 'Tidak Dapat Terhubung ke Server' : 'Deteksi Gagal'}
      </div>

      <div style={{ fontSize: 13, color: '#888', lineHeight: 1.7, maxWidth: 280 }}>
        {isConnection
          ? <>Pastikan <code style={{ background: '#F0E8E0', padding: '1px 6px', borderRadius: 4 }}>python app.py</code> sudah dijalankan, lalu coba lagi.</>
          : <>Tidak ada objek yang terdeteksi. Coba dengan gambar lain menggunakan <strong>latar belakang gelap</strong> dan pencahayaan cukup.</>
        }
      </div>
    </div>
  )
}
