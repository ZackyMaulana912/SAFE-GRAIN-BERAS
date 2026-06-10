import { useEffect, useRef, useState } from 'react'

function useAnimatedCount(target, duration = 900) {
  const [display, setDisplay] = useState(0)
  const raf = useRef(null)

  useEffect(() => {
    if (target === null || target === undefined) return
    const start = performance.now()
    const animate = (now) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.floor(ease * target))
      if (progress < 1) raf.current = requestAnimationFrame(animate)
      else setDisplay(target)
    }
    raf.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf.current)
  }, [target, duration])

  return display
}

export default function StatCard({ label, value, color, dim }) {
  const count = useAnimatedCount(value ?? 0)

  return (
    <div className="rounded-2xl flex flex-col items-center justify-center gap-1 transition-all duration-500"
         style={{
           padding: '20px 12px',
           background: '#fff',
           border: dim ? '2px solid transparent' : `2px solid ${color}22`,
           opacity: dim ? 0.4 : 1,
         }}>
      <span className="font-display font-bold count-animate"
            style={{ fontSize: 32, color: dim ? '#CCC' : color, lineHeight: 1 }}>
        {count}
      </span>
      <span style={{ fontSize: 12, color: '#999', textAlign: 'center', lineHeight: 1.3 }}>
        {label}
      </span>
    </div>
  )
}
