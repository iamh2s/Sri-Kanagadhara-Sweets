
import { useEffect, useRef, useState } from 'react'
import './TraditionalLoader.css'

type TraditionalLoaderProps = {
  isReady?: boolean
  duration?: number
  onComplete?: () => void
}

type Phase = 'intro' | 'exit' | 'open'

const FADE_OUT_MS = 500
const DOORS_MS = 900

const OUTER_PETAL =
  'M150 150 C128 120 132 70 150 40 C168 70 172 120 150 150 Z'

const INNER_PETAL =
  'M150 150 C138 128 140 102 150 82 C160 102 162 128 150 150 Z'

const OUTER_ANGLES = Array.from(
  { length: 8 },
  (_, i) => i * 45,
)

const INNER_ANGLES = Array.from(
  { length: 8 },
  (_, i) => i * 45 + 22.5,
)

const LEAF =
  'M0 0 C9 -11 24 -11 34 0 C24 11 9 11 0 0 Z'

const SPRIG_STEM =
  'M170 290 C120 250 62 212 42 120 C36 92 42 58 60 24'

const SPRIG_LEAVES = [
  { x: 152, y: 262, r: -110 },
  { x: 128, y: 236, r: -190 },
  { x: 100, y: 206, r: -115 },
  { x: 74, y: 170, r: -195 },
  { x: 54, y: 130, r: -120 },
  { x: 46, y: 92, r: -200 },
  { x: 56, y: 56, r: -125 },
]

function Sprig({ mirror = false }: { mirror?: boolean }) {
  return (
    <svg
      className={`tl__sprig${mirror ? ' tl__sprig--mirror' : ''}`}
      viewBox="0 0 200 300"
      aria-hidden="true"
    >
      <path className="tl__stem" d={SPRIG_STEM} />

      {SPRIG_LEAVES.map((leaf, i) => (
        <path
          key={i}
          className="tl__leaf"
          d={LEAF}
          transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.r})`}
        />
      ))}
    </svg>
  )
}

export default function TraditionalLoader({
  isReady = true,
  duration = 2000,
  onComplete,
}: TraditionalLoaderProps) {
  const [minimumPassed, setMinimumPassed] = useState(false)
  const [phase, setPhase] = useState<Phase>('intro')

  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    const timer = window.setTimeout(
      () => setMinimumPassed(true),
      duration,
    )

    return () => window.clearTimeout(timer)
  }, [duration])

  useEffect(() => {
    if (minimumPassed && isReady && phase === 'intro') {
      setPhase('exit')
    }
  }, [minimumPassed, isReady, phase])

  useEffect(() => {
    if (phase === 'exit') {
      const timer = window.setTimeout(
        () => setPhase('open'),
        FADE_OUT_MS,
      )

      return () => window.clearTimeout(timer)
    }

    if (phase === 'open') {
      const timer = window.setTimeout(
        () => onCompleteRef.current?.(),
        DOORS_MS,
      )

      return () => window.clearTimeout(timer)
    }
  }, [phase])

  return (
    <div
      className={`tl tl--${phase}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Sri Kanagadhara Sweets"
    >
      <div
        className="tl__door tl__door--left"
        aria-hidden="true"
      />

      <div
        className="tl__door tl__door--right"
        aria-hidden="true"
      />

      <div className="tl__content">
        <div className="tl__stage">
          <Sprig />

          <div className="tl__medallion">
            <svg
              className="tl__lotus"
              viewBox="0 0 300 300"
              aria-hidden="true"
            >
              {OUTER_ANGLES.map(deg => (
                <path
                  key={`o${deg}`}
                  className="tl__petal tl__petal--outer"
                  d={OUTER_PETAL}
                  transform={`rotate(${deg} 150 150)`}
                />
              ))}

              {INNER_ANGLES.map(deg => (
                <path
                  key={`i${deg}`}
                  className="tl__petal tl__petal--inner"
                  d={INNER_PETAL}
                  transform={`rotate(${deg} 150 150)`}
                />
              ))}

              <circle
                className="tl__pollen"
                cx="150"
                cy="150"
                r="12"
              />
            </svg>

            <div className="tl__logo">
              <img
                src="/brand/sri-kanagadhara-logo.webp"
                alt="Sri Kanagadhara Sweets"
                {...{ fetchpriority: 'high' }}
              />
            </div>
          </div>

          <Sprig mirror />
        </div>

        <div className="tl__text">
          <p className="tl__message">
            Preparing the sweetness…
          </p>

          <p className="tl__tagline">
            A tradition of taste &amp; love
          </p>
        </div>
      </div>
    </div>
  )
}
