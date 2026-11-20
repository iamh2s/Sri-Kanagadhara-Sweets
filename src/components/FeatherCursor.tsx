import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import './FeatherCursor.css'

type CursorEffect = {
  id: number
  x: number
  y: number
  rotation: number
  kind: 'trail' | 'drop' | 'splash'
  symbol: '✦' | '♥' | ''
}

export function FeatherCursor() {
  const cursorRef = useRef<HTMLImageElement>(null)
  const heroArrowRef = useRef<HTMLSpanElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const nextEffectIdRef = useRef(0)
  const previousTrailPointRef = useRef({ x: 0, y: 0 })
  const lastTrailAtRef = useRef(0)
  const [enabled, setEnabled] = useState(false)
  const [effects, setEffects] = useState<CursorEffect[]>([])

  useEffect(() => {
    const pointerMedia = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!pointerMedia.matches) return

    document.body.classList.add('feather-cursor-enabled')
    setEnabled(true)

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const addEffects = (nextEffects: CursorEffect[]) => {
      setEffects((current) => [...current, ...nextEffects].slice(-28))
    }

    const playClickChime = () => {
      const AudioContextConstructor = window.AudioContext
      if (!AudioContextConstructor) return

      const context =
        audioContextRef.current ?? new AudioContextConstructor()
      audioContextRef.current = context

      const playNotes = () => {
        const startAt = context.currentTime
        const partials = [
          { frequency: 659, amplitude: 0.045, attack: 0.025, duration: 0.85 },
          { frequency: 1819, amplitude: 0.016, attack: 0.018, duration: 0.48 },
          { frequency: 3560, amplitude: 0.007, attack: 0.012, duration: 0.3 },
          { frequency: 5885, amplitude: 0.003, attack: 0.01, duration: 0.18 },
        ]

        partials.forEach(({ frequency, amplitude, attack, duration }) => {
          const oscillator = context.createOscillator()
          const gain = context.createGain()

          oscillator.type = 'sine'
          oscillator.frequency.setValueAtTime(frequency, startAt)
          gain.gain.setValueAtTime(0.0001, startAt)
          gain.gain.exponentialRampToValueAtTime(amplitude, startAt + attack)
          gain.gain.exponentialRampToValueAtTime(0.0001, startAt + duration)
          oscillator.connect(gain)
          gain.connect(context.destination)
          oscillator.start(startAt)
          oscillator.stop(startAt + duration)
        })
      }

      if (context.state === 'suspended') {
        void context.resume().then(
          playNotes,
          (error: DOMException) => console.warn('Cursor sound could not be started.', error),
        )
        return
      }

      playNotes()
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return

      const isOverHero =
        event.target instanceof Element && Boolean(event.target.closest('.portal-carousel'))
      const cursor = cursorRef.current
      if (!cursor) return

      cursor.style.transform =
        `translate3d(${event.clientX - 15}px, ${event.clientY - 5}px, 0)`
      cursor.style.opacity = isOverHero ? '0' : '1'
      if (heroArrowRef.current) {
        heroArrowRef.current.style.transform =
          `translate3d(${event.clientX - 12}px, ${event.clientY - 28}px, 0)`
        heroArrowRef.current.style.opacity = isOverHero ? '1' : '0'
      }

      if (reducedMotion.matches) return

      const previous = previousTrailPointRef.current
      const dx = event.clientX - previous.x
      const dy = event.clientY - previous.y
      if (dx * dx + dy * dy < 256) return

      const now = performance.now()
      if (now - lastTrailAtRef.current < 65) return
      previousTrailPointRef.current = { x: event.clientX, y: event.clientY }
      lastTrailAtRef.current = now

      const id = ++nextEffectIdRef.current
      addEffects([{
        id,
        x: event.clientX + (Math.random() * 14 - 7),
        y: event.clientY + (Math.random() * 14 - 7),
        rotation: Math.round(Math.random() * 50 - 25),
        kind: 'trail',
        symbol: id % 3 === 0 ? '♥' : '✦',
      }])
    }

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || event.button !== 0) return

      playClickChime()
      if (reducedMotion.matches) return

      const effects: CursorEffect[] = [{
        id: ++nextEffectIdRef.current,
        x: event.clientX,
        y: event.clientY,
        rotation: 0,
        kind: 'splash',
        symbol: '',
      }]

      for (let index = 0; index < 8; index += 1) {
        const angle = (Math.PI * 2 * index) / 8
        const radius = 18 + (index % 2) * 11
        effects.push({
          id: ++nextEffectIdRef.current,
          x: event.clientX + Math.cos(angle) * radius,
          y: event.clientY + Math.sin(angle) * radius,
          rotation: Math.round((angle * 180) / Math.PI) + 45,
          kind: 'drop',
          symbol: '',
        })
      }

      addEffects(effects)
    }

    const onPointerLeave = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = '0'
      if (heroArrowRef.current) heroArrowRef.current.style.opacity = '0'
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('pointerdown', onPointerDown)
    document.documentElement.addEventListener('pointerleave', onPointerLeave)

    return () => {
      document.body.classList.remove('feather-cursor-enabled')
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerdown', onPointerDown)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [])

  if (!enabled) return null

  return createPortal(
    <div className="feather-cursor-layer" aria-hidden="true">
      {effects.map((effect) => (
        <span
          key={effect.id}
          className={`feather-cursor-effect feather-cursor-effect--${effect.kind}${
            effect.symbol ? ` is-${effect.symbol === '♥' ? 'heart' : 'star'}` : ''
          }`}
          style={{
            left: effect.x,
            top: effect.y,
            rotate: `${effect.rotation}deg`,
          }}
          onAnimationEnd={() =>
            setEffects((current) => current.filter(({ id }) => id !== effect.id))
          }
        >
          {effect.symbol}
        </span>
      ))}
      <img
        ref={cursorRef}
        className="feather-cursor-image"
        src="/brand/cursor-arrow.png"
        alt=""
      />
      <span ref={heroArrowRef} className="feather-cursor-hero-arrow">➜</span>
    </div>,
    document.body,
  )
}
