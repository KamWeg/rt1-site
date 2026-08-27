'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { MenuIcon, MinusIcon, PlusIcon, PowerIcon, StopIcon, Triangle } from './icons'

/**
 * The Pilot screen from the app, rebuilt for the browser and made live.
 *
 * Sizing: every dimension below is written in `em` and equals one Figma
 * pixel, because the panel's font-size resolves to at most 1px. At the
 * design width one em is one pixel; below it the whole remote scales down
 * proportionally instead of reflowing. 342 is the app's 390pt screen less
 * its 24pt side padding.
 *
 * Press feedback is ported from the app's HapticPressable, PillRocker and
 * RemoteScreen — the durations, easings, sink depths and tilt angles are
 * the same numbers, so a key behaves here the way it behaves under a thumb.
 */

const DESIGN_WIDTH = 342

/**
 * The remote's height in the same em units, used by `.remote-fit` in the
 * stylesheet to work out how far it may scale before it stops fitting the
 * viewport. Update it if the stack of controls changes.
 */
export const DESIGN_HEIGHT = 825

/** How long a press stays on the read-out before it falls back to idle. */
const READOUT_MS = 1600

/* ── Motion constants, lifted from the app ─────────────────────────────── */

/** Easing.out(Easing.quad) — every press-in in the app uses this. */
const EASE_OUT_QUAD = 'cubic-bezier(0.5, 1, 0.89, 1)'
/** Easing.out(Easing.cubic) — the ripple's expansion. */
const EASE_OUT_CUBIC = 'cubic-bezier(0.33, 1, 0.68, 1)'
/** Animated.spring(speed 20, bounciness 6) — a touch of overshoot. */
const EASE_SPRING_BACK = 'cubic-bezier(0.34, 1.32, 0.64, 1)'

const PRESS_MS = 90
const RELEASE_MS = 280
/** The sink, which the app releases on a timing curve rather than a spring. */
const SINK_RELEASE_MS = 160
const RIPPLE_MS = 420
const RIPPLE_PEAK_OPACITY = 0.14

/** Figma's shadow presets, in em so they scale with the remote. */
const SHADOW = {
  subtle: '0 2em 6em rgba(0,0,0,0.08)',
  accent: '0 3em 8em rgba(0,0,0,0.14)',
  pressed: '0 1em 2em rgba(0,0,0,0.06)',
  active: '0 4em 10em rgba(0,0,0,0.18)',
  /** Web only: the app has no hover, but a pointer deserves an affordance. */
  hover: '0 3em 9em rgba(0,0,0,0.12)',
  dial: '0 6em 18em rgba(0,0,0,0.10)',
} as const

type Tone = 'dark' | 'light'

const clamp = (value: number) => Math.max(-1, Math.min(1, value))

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * A circle expanding from the touch point and fading as it grows — the app's
 * `useRipple`, and the same visual language as the radar on the scan screen.
 *
 * Driven imperatively rather than through state: a ripple is a transient
 * decoration, and re-rendering the whole remote to draw one would be work
 * for nothing. The surface must already be `position: relative` and clip its
 * overflow, so the wave follows the key's curve instead of spilling out.
 */
function spawnRipple(surface: HTMLElement, x: number, y: number, tone: Tone) {
  if (prefersReducedMotion() || typeof surface.animate !== 'function') return

  const { width, height } = surface.getBoundingClientRect()
  // Oversized, so an off-centre touch still sweeps the whole surface
  const diameter = Math.max(width, height) * 2

  const wave = document.createElement('span')
  wave.setAttribute('aria-hidden', 'true')
  Object.assign(wave.style, {
    position: 'absolute',
    left: `${x - diameter / 2}px`,
    top: `${y - diameter / 2}px`,
    width: `${diameter}px`,
    height: `${diameter}px`,
    borderRadius: '9999px',
    pointerEvents: 'none',
    background: tone === 'dark' ? 'var(--color-ink)' : 'var(--color-on-dark)',
    opacity: '0',
  })
  surface.appendChild(wave)

  const animation = wave.animate(
    [
      { transform: 'scale(0.3)', opacity: RIPPLE_PEAK_OPACITY },
      { transform: 'scale(1)', opacity: 0 },
    ],
    { duration: RIPPLE_MS, easing: EASE_OUT_CUBIC },
  )

  // `finished` normally settles the moment the wave has faded. It does not
  // settle at all while the tab is hidden, because animations stop
  // advancing — so a press made just before someone switches away would
  // leave the node behind for good. The timer is the backstop; remove() is
  // idempotent, so whichever arrives first wins.
  const clean = () => wave.remove()
  animation.finished.then(clean, clean)
  setTimeout(clean, RIPPLE_MS + 100)
}

/** Where a pointer landed, in the target's own coordinates and as −1…1. */
function readPoint(event: React.PointerEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  return {
    x,
    y,
    offsetX: rect.width ? clamp((x - rect.width / 2) / (rect.width / 2)) : 0,
    offsetY: rect.height ? clamp((y - rect.height / 2) / (rect.height / 2)) : 0,
  }
}

/* ── The remote ────────────────────────────────────────────────────────── */

type Press = { label: string; sticky?: boolean }

/** How long after load the self test starts — the hero has settled by then. */
const BOOT_DELAY_MS = 900
/** Gap between one key lighting and the next. */
const BOOT_STEP_MS = 48

export function Remote({ idleLabel }: { idleLabel: string }) {
  const panel = useRef<HTMLDivElement>(null)
  const [readout, setReadout] = useState<string | null>(null)
  const [volume, setVolume] = useState(14)
  const [channel, setChannel] = useState(5)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [standby, setStandby] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  /**
   * Self test on load: every key lights in turn, top to bottom, the way a
   * piece of hardware proves itself before it hands over control. It reuses
   * the press ripple rather than inventing a second kind of glow, so what
   * the page shows you is exactly what your own press will do.
   */
  useEffect(() => {
    const root = panel.current
    if (!root || prefersReducedMotion()) return

    const keys = Array.from(root.querySelectorAll<HTMLElement>('[data-tone]'))
    const timers = keys.map((key, i) =>
      setTimeout(() => {
        const { width, height } = key.getBoundingClientRect()
        spawnRipple(key, width / 2, height / 2, key.dataset.tone === 'light' ? 'light' : 'dark')
      }, BOOT_DELAY_MS + i * BOOT_STEP_MS),
    )

    const done = setTimeout(() => {
      setReadout('Ready')
      timer.current = setTimeout(() => setReadout(null), READOUT_MS)
    }, BOOT_DELAY_MS + keys.length * BOOT_STEP_MS)

    return () => {
      for (const t of timers) clearTimeout(t)
      clearTimeout(done)
    }
  }, [])

  const announce = useCallback(({ label, sticky }: Press) => {
    if (timer.current) clearTimeout(timer.current)
    setReadout(label)
    if (!sticky) timer.current = setTimeout(() => setReadout(null), READOUT_MS)
  }, [])

  // Next values are derived before the state is set, never inside the
  // updater — an updater has to stay pure, and React calls it twice in
  // development to prove it.
  const bumpVolume = (delta: number) => {
    const next = Math.min(30, Math.max(0, volume + delta))
    setVolume(next)
    setMuted(false)
    announce({ label: `Vol ${next}` })
  }

  const bumpChannel = (delta: number) => {
    const next = ((channel - 1 + delta + 99) % 99) + 1
    setChannel(next)
    announce({ label: `Ch ${String(next).padStart(2, '0')}` })
  }

  return (
    <div className="w-full" style={{ containerType: 'inline-size' }}>
      <div
        ref={panel}
        className="mx-auto"
        style={{
          // Three caps, smallest wins: the per-instance ceiling (set by
          // `.remote-fit` from the viewport height on wide screens), the
          // container width, and 1px — one em must never exceed one Figma
          // pixel or the remote would render larger than it was drawn.
          fontSize: `min(var(--remote-cap, 1px), calc(100cqw / ${DESIGN_WIDTH}))`,
          width: `${DESIGN_WIDTH}em`,
          maxWidth: '100%',
        }}
      >
        {/* ── Power ─────────────────────────────────────────────────
            The app puts a logotype lockup beside this key. On the site the
            logotype is already the hero, so repeating it here would say the
            same thing twice — the key sits alone, close above the dial. */}
        <div className="flex justify-end" style={{ marginBottom: '12em' }}>
          <Key
            label={standby ? 'Wake television' : 'Put television on standby'}
            size={47}
            variant="accent"
            emphasis
            onPress={() => {
              setStandby(!standby)
              announce({ label: standby ? 'Power on' : 'Standby', sticky: !standby })
            }}
          >
            <PowerIcon size={22} unit="em" className="text-white" />
          </Key>
        </div>

        <Dial
          standby={standby}
          onArrow={(direction) => announce({ label: direction })}
          onOk={() => announce({ label: 'OK' })}
        />

        {/* ── Transport ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-center" style={{ gap: '18em', marginTop: '30em' }}>
          <Key label="Rewind" size={52} onPress={() => announce({ label: 'Rewind' })}>
            <span className="flex" style={{ gap: '2em' }}>
              <Triangle width={9} height={7} direction="left" unit="em" className="fill-glyph" />
              <Triangle width={9} height={7} direction="left" unit="em" className="fill-glyph" />
            </span>
          </Key>

          <Key
            label={playing ? 'Pause' : 'Play'}
            size={56}
            variant="dark"
            onPress={() => {
              setPlaying(!playing)
              announce({ label: playing ? 'Pause' : 'Play' })
            }}
          >
            {playing ? (
              <span className="flex" style={{ gap: '4em' }}>
                <span className="bg-on-dark" style={{ width: '3.5em', height: '14em', borderRadius: '1em' }} />
                <span className="bg-on-dark" style={{ width: '3.5em', height: '14em', borderRadius: '1em' }} />
              </span>
            ) : (
              <Triangle width={13} height={11} direction="right" unit="em" className="fill-[#F5F4F0]" />
            )}
          </Key>

          <Key label="Fast forward" size={52} onPress={() => announce({ label: 'Forward' })}>
            <span className="flex" style={{ gap: '2em' }}>
              <Triangle width={9} height={7} direction="right" unit="em" className="fill-glyph" />
              <Triangle width={9} height={7} direction="right" unit="em" className="fill-glyph" />
            </span>
          </Key>
        </div>

        {/* ── Rockers and centre column ─────────────────────────────── */}
        <div className="flex items-start justify-between" style={{ marginTop: '30em' }}>
          <Rocker
            label="Volume"
            caption="Vol"
            top={{ label: 'Volume up', node: <PlusIcon size={12} unit="em" className="fill-glyph" />, onPress: () => bumpVolume(1) }}
            bottom={{ label: 'Volume down', node: <MinusIcon size={12} unit="em" className="fill-glyph" />, onPress: () => bumpVolume(-1) }}
          />

          <div className="flex flex-col items-center" style={{ gap: '14em', paddingTop: '18em' }}>
            <Key
              label={muted ? 'Unmute' : 'Mute'}
              size={56}
              onPress={() => {
                setMuted(!muted)
                announce({ label: muted ? 'Unmute' : 'Mute', sticky: !muted })
              }}
              held={muted}
            >
              <span
                className="text-glyph"
                style={{ fontSize: '13em', letterSpacing: '0.06em', fontWeight: 600, lineHeight: 1 }}
              >
                M
              </span>
            </Key>
            <Key label="Change input" size={56} onPress={() => announce({ label: 'Input' })}>
              <span
                className="text-glyph"
                style={{ fontSize: '12em', letterSpacing: '0.08em', fontWeight: 600, lineHeight: 1 }}
              >
                AV
              </span>
            </Key>
          </div>

          <Rocker
            label="Channel"
            caption="Ch"
            top={{ label: 'Channel up', node: <Triangle width={11} height={8} direction="up" unit="em" className="fill-glyph" />, onPress: () => bumpChannel(1) }}
            bottom={{ label: 'Channel down', node: <Triangle width={11} height={8} direction="down" unit="em" className="fill-glyph" />, onPress: () => bumpChannel(-1) }}
          />
        </div>

        {/* ── Footer keys ───────────────────────────────────────────── */}
        <div className="flex items-start justify-center" style={{ gap: '46em', marginTop: '30em' }}>
          <FooterKey caption="Back" label="Back" onPress={() => announce({ label: 'Back' })}>
            <Triangle width={11} height={8} direction="left" unit="em" className="fill-glyph" />
          </FooterKey>
          <FooterKey caption="Home" label="Home" onPress={() => announce({ label: 'Home' })}>
            <StopIcon size={14} unit="em" className="stroke-glyph" />
          </FooterKey>
          <FooterKey caption="Menu" label="Menu" onPress={() => announce({ label: 'Menu' })}>
            <MenuIcon unit="em" className="fill-glyph" />
          </FooterKey>
        </div>

        {/* ── Fastext row ───────────────────────────────────────────────
            Decorative, exactly as in the app: the MVP has no colour keys to
            send, so these are marks rather than controls. */}
        <div
          className="flex items-center justify-center"
          style={{ gap: '18em', marginTop: '22em' }}
          aria-hidden="true"
        >
          {[
            'var(--color-fastext-red)',
            'var(--color-fastext-green)',
            'var(--color-fastext-yellow)',
            'var(--color-fastext-blue)',
          ].map((colour) => (
            <span
              key={colour}
              className="rounded-full"
              style={{ width: '10em', height: '10em', background: colour }}
            />
          ))}
        </div>

        {/* ── Read-out ──────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-center border-t border-border"
          style={{ marginTop: '20em', paddingTop: '14em' }}
        >
          <p
            aria-live="polite"
            className="micro-s"
            style={{
              fontSize: '10em',
              color: readout ? 'var(--color-ink)' : 'var(--color-muted)',
              transition: 'color 160ms ease-out',
            }}
          >
            {readout ?? idleLabel}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ── Parts ─────────────────────────────────────────────────────────────── */

type KeyVariant = 'surface' | 'dark' | 'accent'

/** The ripple has to read against the key's own surface, not the page. */
const RIPPLE_TONE: Record<KeyVariant, Tone> = {
  surface: 'dark',
  dark: 'light',
  accent: 'light',
}

/**
 * A circular key, carrying the app's press feedback in full: it sinks 6% and
 * drops 1.5px in 90ms, tips towards the finger as though pivoting on a centre
 * post, flattens its shadow while held, and throws a ripple from the point
 * that was touched. Release springs back with a trace of overshoot.
 *
 * `emphasis` is the app's setting for the primary keys — power and OK — which
 * sink a little deeper and tilt a little further.
 */
function Key({
  children,
  label,
  size,
  onPress,
  variant = 'surface',
  emphasis = false,
  held = false,
}: {
  children: React.ReactNode
  label: string
  size: number
  onPress: () => void
  variant?: KeyVariant
  emphasis?: boolean
  /** Latched down — the app's pressedStyle applied to a toggled-on key. */
  held?: boolean
}) {
  const [tilt, setTilt] = useState<{ x: number; y: number } | null>(null)
  const [hovered, setHovered] = useState(false)
  const depth = emphasis ? 1.3 : 1
  const maxTilt = emphasis ? 10 : 8
  const pressed = tilt !== null

  const background =
    variant === 'dark' ? 'var(--color-dark)' : variant === 'accent' ? 'var(--color-accent)' : 'var(--color-surface)'
  const resting =
    variant === 'accent' ? SHADOW.accent : variant === 'dark' ? SHADOW.active : SHADOW.subtle

  return (
    <button
      type="button"
      aria-label={label}
      data-tone={RIPPLE_TONE[variant]}
      onClick={onPress}
      onPointerDown={(event) => {
        const point = readPoint(event)
        setTilt({ x: point.offsetX, y: point.offsetY })
        spawnRipple(event.currentTarget, point.x, point.y, RIPPLE_TONE[variant])
      }}
      onPointerUp={() => setTilt(null)}
      onPointerLeave={() => { setTilt(null); setHovered(false) }}
      onPointerCancel={() => setTilt(null)}
      onPointerEnter={() => setHovered(true)}
      // A key reached by keyboard has no touch point, so it sinks straight
      // down and the ripple starts from its centre.
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return
        if (event.repeat || pressed) return
        setTilt({ x: 0, y: 0 })
        const rect = event.currentTarget.getBoundingClientRect()
        spawnRipple(event.currentTarget, rect.width / 2, rect.height / 2, RIPPLE_TONE[variant])
      }}
      onKeyUp={() => setTilt(null)}
      onBlur={() => setTilt(null)}
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full"
      style={{
        width: `${size}em`,
        height: `${size}em`,
        background,
        color: variant === 'surface' ? 'var(--color-glyph)' : 'var(--color-on-dark)',
        border: variant === 'surface' ? '1px solid var(--color-border)' : undefined,
        boxShadow: pressed || held ? SHADOW.pressed : hovered ? SHADOW.hover : resting,
        transform: pressed
          ? `perspective(600px) rotateX(${maxTilt * tilt.y}deg) rotateY(${-maxTilt * tilt.x}deg) scale(${1 - 0.06 * depth}) translateY(${1.5 * depth}em)`
          : 'none',
        transition: pressed
          ? `transform ${PRESS_MS}ms ${EASE_OUT_QUAD}, box-shadow ${PRESS_MS}ms ${EASE_OUT_QUAD}`
          : `transform ${RELEASE_MS}ms ${EASE_SPRING_BACK}, box-shadow ${SINK_RELEASE_MS}ms ${EASE_OUT_QUAD}`,
      }}
    >
      {children}
    </button>
  )
}

type Direction = 'up' | 'down' | 'left' | 'right'

/** Which way the disc tips for each arrow — the app's arrowHandlers(x, y). */
const ARROW_VECTOR: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

/** Degrees the whole dial tips towards whichever arrow is held. */
const DIAL_TILT = 5

/**
 * The directional dial.
 *
 * The arrows do not animate themselves. The dial is one physical disc, so
 * pressing an arrow tips the whole thing that way and flattens its shadow —
 * the arrow only reports which way. That is the app's arrangement, and it is
 * the reason the dial reads as a disc rather than four separate buttons.
 */
function Dial({
  standby,
  onArrow,
  onOk,
}: {
  standby: boolean
  onArrow: (direction: string) => void
  onOk: () => void
}) {
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null)

  return (
    <div
      className="relative mx-auto rounded-full bg-surface"
      style={{
        width: '300em',
        height: '300em',
        boxShadow: tip ? SHADOW.subtle : SHADOW.dial,
        opacity: standby ? 0.55 : 1,
        transform: tip
          ? `perspective(900px) rotateY(${DIAL_TILT * tip.x}deg) rotateX(${-DIAL_TILT * tip.y}deg)`
          : 'none',
        // Held for 90ms, released over 220ms — the disc settles back slower
        // than it tips, which is what makes it feel weighted.
        transition: tip
          ? `transform ${PRESS_MS}ms ${EASE_OUT_QUAD}, box-shadow ${PRESS_MS}ms ${EASE_OUT_QUAD}, opacity 240ms ease-out`
          : `transform 220ms ${EASE_OUT_QUAD}, box-shadow 220ms ${EASE_OUT_QUAD}, opacity 240ms ease-out`,
      }}
    >
      {(Object.keys(ARROW_VECTOR) as Direction[]).map((direction) => (
        <DialKey
          key={direction}
          direction={direction}
          onPress={() => onArrow(direction[0].toUpperCase() + direction.slice(1))}
          onHold={(held) => setTip(held ? ARROW_VECTOR[direction] : null)}
        />
      ))}

      <div
        className="absolute left-1/2 top-1/2"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <Key label="OK" size={104} variant="dark" emphasis onPress={onOk}>
          <span className="micro-l" style={{ fontSize: '15em', letterSpacing: '0.12em', fontWeight: 600 }}>
            OK
          </span>
        </Key>
      </div>
    </div>
  )
}

/**
 * One arrow zone on the dial. It ripples, but does not sink or tilt — the
 * app gives these `pressDepth={0}` and no tilt, leaving the movement to the
 * disc underneath.
 */
function DialKey({
  direction,
  onPress,
  onHold,
}: {
  direction: Direction
  onPress: () => void
  onHold: (held: boolean) => void
}) {
  const inset: React.CSSProperties =
    direction === 'up'
      ? { top: 0, left: '50%', transform: 'translateX(-50%)' }
      : direction === 'down'
        ? { bottom: 0, left: '50%', transform: 'translateX(-50%)' }
        : direction === 'left'
          ? { left: 0, top: '50%', transform: 'translateY(-50%)' }
          : { right: 0, top: '50%', transform: 'translateY(-50%)' }

  const name = direction[0].toUpperCase() + direction.slice(1)

  return (
    <button
      type="button"
      aria-label={name}
      data-tone="dark"
      onClick={onPress}
      onPointerDown={(event) => {
        const point = readPoint(event)
        onHold(true)
        spawnRipple(event.currentTarget, point.x, point.y, 'dark')
      }}
      onPointerUp={() => onHold(false)}
      onPointerLeave={() => onHold(false)}
      onPointerCancel={() => onHold(false)}
      onKeyDown={(event) => {
        if ((event.key !== 'Enter' && event.key !== ' ') || event.repeat) return
        onHold(true)
        const rect = event.currentTarget.getBoundingClientRect()
        spawnRipple(event.currentTarget, rect.width / 2, rect.height / 2, 'dark')
      }}
      onKeyUp={() => onHold(false)}
      onBlur={() => onHold(false)}
      className="absolute flex items-center justify-center overflow-hidden rounded-full"
      style={{ width: '74em', height: '74em', ...inset }}
    >
      <Triangle width={11} height={8} direction={direction} unit="em" className="fill-glyph" />
    </button>
  )
}

/** Degrees the pressed end of a rocker dips. */
const ROCKER_TIP = 7
/** …plus a small shift, so the movement reads on a flat-on view too. */
const ROCKER_SHIFT = 1.5

/**
 * A 76×148 pill holding two press zones.
 *
 * A rocker is one rocking key, not two buttons stacked, so the feedback
 * belongs to the whole pill: pressing an end pivots the pill about its
 * middle and squeezes it very slightly, and the ripple is owned and clipped
 * by the pill rather than by the half that was touched — clipping per half
 * would cut the wave off with a straight edge across the centre.
 */
function Rocker({
  label,
  top,
  bottom,
  caption,
}: {
  label: string
  top: { label: string; node: React.ReactNode; onPress: () => void }
  bottom: { label: string; node: React.ReactNode; onPress: () => void }
  caption: string
}) {
  const pill = useRef<HTMLDivElement>(null)
  const [end, setEnd] = useState<'top' | 'bottom' | null>(null)

  const hold = (which: 'top' | 'bottom') => () => {
    setEnd(which)
    const surface = pill.current
    if (!surface) return
    // The wave starts at the middle of the half that was pressed, derived
    // from geometry rather than the touch point — the app does the same, so
    // that a press anywhere in a zone produces the same movement.
    const { width, height } = surface.getBoundingClientRect()
    spawnRipple(surface, width / 2, height * (which === 'top' ? 0.25 : 0.75), 'dark')
  }

  const release = () => setEnd(null)
  const tip = end === 'top' ? -1 : end === 'bottom' ? 1 : 0

  return (
    <div className="flex flex-col items-center" style={{ gap: '10em' }}>
      <div
        ref={pill}
        role="group"
        aria-label={label}
        data-tone="dark"
        className="relative flex flex-col items-center justify-between overflow-hidden bg-surface"
        style={{
          width: '76em',
          height: '148em',
          borderRadius: '38em',
          border: '1px solid var(--color-border)',
          boxShadow: end ? SHADOW.pressed : SHADOW.subtle,
          padding: '18em 0',
          transform: end
            ? `perspective(500px) rotateX(${ROCKER_TIP * tip}deg) translateY(${ROCKER_SHIFT * tip}em) scale(0.985)`
            : 'none',
          transition: end
            ? `transform ${PRESS_MS}ms ${EASE_OUT_QUAD}, box-shadow ${PRESS_MS}ms ${EASE_OUT_QUAD}`
            : `transform ${RELEASE_MS}ms ${EASE_SPRING_BACK}, box-shadow ${SINK_RELEASE_MS}ms ${EASE_OUT_QUAD}`,
        }}
      >
        <RockerZone {...top} onHold={hold('top')} onRelease={release} />
        <span className="rounded-full bg-border" style={{ width: '4em', height: '4em' }} aria-hidden="true" />
        <RockerZone {...bottom} onHold={hold('bottom')} onRelease={release} />
      </div>
      <span className="micro-s text-muted" style={{ fontSize: '9em' }}>
        {caption}
      </span>
    </div>
  )
}

function RockerZone({
  label,
  node,
  onPress,
  onHold,
  onRelease,
}: {
  label: string
  node: React.ReactNode
  onPress: () => void
  onHold: () => void
  onRelease: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onPress}
      onPointerDown={onHold}
      onPointerUp={onRelease}
      onPointerLeave={onRelease}
      onPointerCancel={onRelease}
      onKeyDown={(event) => {
        if ((event.key === 'Enter' || event.key === ' ') && !event.repeat) onHold()
      }}
      onKeyUp={onRelease}
      onBlur={onRelease}
      className="flex items-center justify-center rounded-full"
      style={{ width: '44em', height: '44em' }}
    >
      {node}
    </button>
  )
}

function FooterKey({
  children,
  caption,
  label,
  onPress,
}: {
  children: React.ReactNode
  caption: string
  label: string
  onPress: () => void
}) {
  return (
    <div className="flex flex-col items-center" style={{ gap: '10em' }}>
      <Key label={label} size={52} onPress={onPress}>
        {children}
      </Key>
      <span className="micro-s text-muted" style={{ fontSize: '8em' }}>
        {caption}
      </span>
    </div>
  )
}
