import { useState, useCallback } from 'react'
import { detectRice } from '../utils/api'
import { calculateGrade } from '../utils/grading'

const initialState = {
  image: null,          // base64 data URL
  resultImage: null,    // annotated image from server
  isScanning: false,
  isProcessed: false,
  result: null,         // from calculateGrade()
  counts: null,         // { utuh, pecah, bendaAsing }
  processingMs: null,
  error: null,
}

export function useDetection() {
  const [state, setState] = useState(initialState)

  const handleImageUpload = useCallback((file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setState({
        ...initialState,
        image: e.target.result,
      })
    }
    reader.readAsDataURL(file)
  }, [])

  const startScan = useCallback(async (basePrice) => {
    if (!state.image || state.isProcessed) return

    setState(s => ({ ...s, isScanning: true, error: null }))

    try {
      const data = await detectRice(state.image, basePrice)

      const counts = {
        utuh: data.utuh,
        pecah: data.pecah,
        bendaAsing: data.benda_asing,
      }

      if (counts.utuh === 0 && counts.pecah === 0 && counts.bendaAsing === 0) {
        setState(s => ({
          ...s,
          isScanning: false,
          error: 'no_detection',
        }))
        return
      }

      const result = calculateGrade(
        counts.utuh,
        counts.pecah,
        counts.bendaAsing,
        parseInt(basePrice) || 0
      )

      setState(s => ({
        ...s,
        isScanning: false,
        isProcessed: true,
        resultImage: data.debug_image,
        counts,
        result,
        processingMs: data.processing_time_ms,
        error: null,
      }))
    } catch (err) {
      setState(s => ({
        ...s,
        isScanning: false,
        error: err.message || 'connection_error',
      }))
    }
  }, [state.image, state.isProcessed])

  const reset = useCallback(() => {
    setState(initialState)
  }, [])

  return {
    ...state,
    handleImageUpload,
    startScan,
    reset,
  }
}
