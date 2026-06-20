import { useEffect, useId, useState } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

type SparkleDirection = 'none' | 'top' | 'bottom' | 'left' | 'right'

interface SparklesProps {
  className?: string
  size?: number
  minSize?: number | null
  density?: number
  speed?: number
  minSpeed?: number | null
  opacity?: number
  opacitySpeed?: number
  minOpacity?: number | null
  color?: string
  background?: string
  /** Drift direction for the particles (default: 'none' = random). */
  direction?: SparkleDirection
  options?: Record<string, unknown>
}

// Engine is loaded once for the whole app.
let enginePromise: Promise<void> | null = null

/**
 * Lightweight drifting-sparkles particle layer. Render inside a positioned,
 * overflow-hidden container — it fills the parent (fullScreen disabled).
 */
export function Sparkles({
  className,
  size = 1,
  minSize = null,
  density = 800,
  speed = 1,
  minSpeed = null,
  opacity = 1,
  opacitySpeed = 3,
  minOpacity = null,
  color = '#FFFFFF',
  background = 'transparent',
  direction = 'none',
  options = {},
}: SparklesProps) {
  const [isReady, setIsReady] = useState(false)
  const id = useId()

  useEffect(() => {
    if (!enginePromise) {
      enginePromise = initParticlesEngine(async (engine) => {
        await loadSlim(engine)
      })
    }
    enginePromise.then(() => setIsReady(true))
  }, [])

  const defaultOptions = {
    background: { color: { value: background } },
    fullScreen: { enable: false, zIndex: 1 },
    fpsLimit: 120,
    particles: {
      color: { value: color },
      move: {
        enable: true,
        direction,
        speed: { min: minSpeed || speed / 10, max: speed },
        straight: false,
        // When rising/falling, respawn off the opposite edge for a continuous stream.
        outModes: direction === 'none' ? { default: 'out' } : { default: 'out', top: 'destroy', bottom: 'none' },
      },
      number: { value: density },
      opacity: {
        value: { min: minOpacity || opacity / 10, max: opacity },
        animation: { enable: true, sync: false, speed: opacitySpeed },
      },
      size: { value: { min: minSize || size / 2.5, max: size } },
    },
    detectRetina: true,
  }

  if (!isReady) return null

  return (
    <Particles
      id={id}
      options={{ ...defaultOptions, ...options } as never}
      className={className}
    />
  )
}
