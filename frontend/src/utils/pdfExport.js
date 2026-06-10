import { jsPDF } from 'jspdf'

export function exportPDF({ result, counts, processingMs }) {
  const doc = new jsPDF()
  const { grade, label, formattedPrice, percentUtuh } = result
  const dateStr = new Date().toLocaleString('id-ID')

  // Header bar
  doc.setFillColor(61, 48, 40)
  doc.rect(0, 0, 210, 44, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text('Safe Grain', 20, 22)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('Smart Rice Detector — Laporan Analisis Kualitas Beras', 20, 34)

  // Meta
  doc.setTextColor(60, 60, 60)
  doc.setFontSize(9)
  doc.text(`Tanggal   : ${dateStr}`, 20, 56)
  doc.text(`Proses AI : ${processingMs ? processingMs + ' ms' : '-'}`, 20, 64)

  doc.setDrawColor(220, 210, 200)
  doc.line(20, 70, 190, 70)

  // Grade
  doc.setFontSize(11)
  doc.setTextColor(140, 140, 140)
  doc.text('Hasil Deteksi', 20, 82)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(194, 142, 114)
  doc.text(grade, 20, 96)
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text(label, 20, 107)

  doc.line(20, 116, 190, 116)

  // Detail
  const rows = [
    ['Butir Utuh',        `${counts.utuh} butir`],
    ['Butir Pecah',       `${counts.pecah} butir`],
    ['Benda Asing',       `${counts.bendaAsing} objek`],
    ['Tingkat Keutuhan',  `${percentUtuh}%`],
  ]
  doc.setFontSize(11)
  doc.setTextColor(40, 40, 40)
  rows.forEach(([k, v], i) => {
    const y = 130 + i * 13
    doc.setFont('helvetica', 'normal')
    doc.text(k, 20, y)
    doc.setFont('helvetica', 'bold')
    if (k === 'Benda Asing' && counts.bendaAsing > 0) doc.setTextColor(200, 60, 60)
    else doc.setTextColor(40, 40, 40)
    doc.text(v, 190, y, { align: 'right' })
  })

  doc.line(20, 188, 190, 188)

  // Price
  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.setFont('helvetica', 'normal')
  doc.text('Estimasi Harga Jual', 20, 202)
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(61, 48, 40)
  doc.text(formattedPrice, 190, 202, { align: 'right' })

  // Footer
  doc.setFontSize(8)
  doc.setTextColor(180, 180, 180)
  doc.setFont('helvetica', 'italic')
  doc.text('Digenerate otomatis oleh Safe Grain v3.0 — Smart Rice Detector', 105, 280, { align: 'center' })

  doc.save(`SafeGrain_${Date.now()}.pdf`)
}
