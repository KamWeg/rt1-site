'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { MenuIcon, MinusIcon, PlusIcon, PowerIcon, StopIcon, Triangle } from './icons'

/**
 * The Pilot screen from the app, rebuilt for the browser and made live.
 *
 * Sizing: every dimension below is written in `em` and equals one Figma
 * pixel, because the panel's font-size is `min(1px, 100cqw / 342)`. At the
 * design width one em is one pixel; below it the whole remote scales down
 * proportionally instead of reflowing. 342 is the app's 390pt screen less
 * its 24pt side padding.
 */

const DESIGN_WIDTH = 342

/** How long a press stays on the read-out before it falls back to idle. */
const READOUT_MS = 1600

type Press = { label: string; sticky?: boolean }

export function Remote({ idleLabel }: { idleLabel: string }) {
  const [readout, setReadout] = useState<string | null>(null)
  const [volume, setVolume] = useState(14)
  const [channel, setChannel] = useState(5)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [standby, setStandby] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

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
    <div
      className="w-full"
      style={{ containerType: 'inline-size' }}
    >
      <div
        className="mx-auto"
        style={{
          fontSize: `min(1px, calc(100cqw / ${DESIGN_WIDTH}))`,
          width: `${DESIGN_WIDTH}em`,
          maxWidth: '100%',
        }}
      >
        {/* ── Header: logotype block and power ─────────────────────── */}
        <div className="flex items-start justify-between" style={{ marginBottom: '26em' }}>
          <div>
            <div className="flex items-baseline" style={{ gap: '7em' }}>
              <span
                className="font-serif-display text-ink"
                style={{ fontSize: '23em', lineHeight: 1 }}
              >
                RT 1
              </span>
              {/* Accent 1 of 3 */}
              <span
                className="micro-l text-accent"
                style={{ fontSize: '12em', letterSpacing: '0.14em' }}
              >
                Remote
              </span>
            </div>
            <div
              className="micro-s text-muted"
              style={{ fontSize: '9em', letterSpacing: '0.14em', marginTop: '6em' }}
            >
              {standby ? 'Standby' : 'Settings'}
            </div>
          </div>

          {/* Accent 2 of 3 */}
          <Key
            label={standby ? 'Wake television' : 'Put television on standby'}
            size={47}
            variant="accent"
            onPress={() => {
              setStandby(!standby)
              announce({ label: standby ? 'Power on' : 'Standby', sticky: !standby })
            }}
          >
            <PowerIcon size={22} className="text-white" />
          </Key>
        </div>

        {/* ── Directional dial ──────────────────────────────────────── */}
        <div
          className="relative mx-auto rounded-full bg-surface"
          style={{
            width: '300em',
            height: '300em',
            boxShadow: '0 6em 18em rgba(0,0,0,0.10)',
            opacity: standby ? 0.55 : 1,
            transition: 'opacity 240ms ease-out',
          }}
        >
          <DialKey position="up" onPress={() => announce({ label: 'Up' })} />
          <DialKey position="down" onPress={() => announce({ label: 'Down' })} />
          <DialKey position="left" onPress={() => announce({ label: 'Left' })} />
          <DialKey position="right" onPress={() => announce({ label: 'Right' })} />

          <button
            type="button"
            onClick={() => announce({ label: 'OK' })}
            className="group absolute left-1/2 top-1/2 flex items-center justify-center rounded-full bg-dark text-on-dark transition-shadow duration-150"
            style={{
              width: '104em',
              height: '104em',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 4em 10em rgba(0,0,0,0.18)',
            }}
          >
            <span
              className="micro-l"
              style={{ fontSize: '15em', letterSpacing: '0.12em', fontWeight: 600 }}
            >
              OK
            </span>
          </button>
        </div>

        {/* ── Transport ─────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-center"
          style={{ gap: '18em', marginTop: '30em' }}
        >
          <Key label="Rewind" size={52} onPress={() => announce({ label: 'Rewind' })}>
            <span className="flex" style={{ gap: '2em' }}>
              <Triangle width={9} height={7} direction="left" className="fill-glyph" />
              <Triangle width={9} height={7} direction="left" className="fill-glyph" />
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
              <Triangle width={13} height={11} direction="right" className="fill-[#F5F4F0]" />
            )}
          </Key>

          <Key label="Fast forward" size={52} onPress={() => announce({ label: 'Forward' })}>
            <span className="flex" style={{ gap: '2em' }}>
              <Triangle width={9} height={7} direction="right" className="fill-glyph" />
              <Triangle width={9} height={7} direction="right" className="fill-glyph" />
            </span>
          </Key>
        </div>

        {/* ── Rockers and centre column ─────────────────────────────── */}
        <div
          className="flex items-start justify-between"
          style={{ marginTop: '30em' }}
        >
          <Rocker
            label="Volume"
            top={{ label: 'Volume up', node: <PlusIcon size={12} className="fill-glyph" />, onPress: () => bumpVolume(1) }}
            bottom={{ label: 'Volume down', node: <MinusIcon size={12} className="fill-glyph" />, onPress: () => bumpVolume(-1) }}
            caption="Vol"
          />

          <div className="flex flex-col items-center" style={{ gap: '14em', paddingTop: '18em' }}>
            <Key
              label={muted ? 'Unmute' : 'Mute'}
              size={56}
              onPress={() => {
                setMuted(!muted)
                announce({ label: muted ? 'Unmute' : 'Mute', sticky: !muted })
              }}
              pressedLook={muted}
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
            top={{ label: 'Channel up', node: <Triangle width={11} height={8} direction="up" className="fill-glyph" />, onPress: () => bumpChannel(1) }}
            bottom={{ label: 'Channel down', node: <Triangle width={11} height={8} direction="down" className="fill-glyph" />, onPress: () => bumpChannel(-1) }}
            caption="Ch"
          />
        </div>

        {/* ── Footer keys ───────────────────────────────────────────── */}
        <div
          className="flex items-start justify-center"
          style={{ gap: '46em', marginTop: '30em' }}
        >
          <FooterKey caption="Back" label="Back" onPress={() => announce({ label: 'Back' })}>
            <Triangle width={11} height={8} direction="left" className="fill-glyph" />
          </FooterKey>
          <FooterKey caption="Home" label="Home" onPress={() => announce({ label: 'Home' })}>
            <StopIcon size={14} className="stroke-glyph" />
          </FooterKey>
          <FooterKey caption="Menu" label="Menu" onPress={() => announce({ label: 'Menu' })}>
            <MenuIcon className="fill-glyph" />
          </FooterKey>
        </div>

        {/* ── Fastext keys ──────────────────────────────────────────── */}
        <div
          className="flex items-center justify-center"
          style={{ gap: '18em', marginTop: '28em' }}
        >
          {(
            [
              ['Red', 'var(--color-fastext-red)'],
              ['Green', 'var(--color-fastext-green)'],
              ['Yellow', 'var(--color-fastext-yellow)'],
              ['Blue', 'var(--color-fastext-blue)'],
            ] as const
          ).map(([name, colour]) => (
            <button
              key={name}
              type="button"
              aria-label={`${name} teletext key`}
              onClick={() => announce({ label: `${name} key` })}
              className="rounded-full transition-transform duration-150"
              style={{ width: '10em', height: '10em', background: colour }}
            />
          ))}
        </div>

        {/* ── Read-out ──────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-center border-t border-border"
          style={{ marginTop: '28em', paddingTop: '16em' }}
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

/**
 * A circular key. Pressing it drops the shadow from `subtle` to `pressed`
 * so the key appears to sit down on the surface — the app's feedback, and
 * the reason nothing here scales on hover.
 */
function Key({
  children,
  label,
  size,
  onPress,
  variant = 'surface',
  pressedLook = false,
}: {
  children: React.ReactNode
  label: string
  size: number
  onPress: () => void
  variant?: 'surface' | 'dark' | 'accent'
  pressedLook?: boolean
}) {
  const background =
    variant === 'dark' ? 'var(--color-dark)' : variant === 'accent' ? 'var(--color-accent)' : 'var(--color-surface)'
  const resting =
    variant === 'surface' ? '0 2em 6em rgba(0,0,0,0.08)' : '0 3em 8em rgba(0,0,0,0.14)'

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onPress}
      className="key flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: `${size}em`,
        height: `${size}em`,
        background,
        boxShadow: pressedLook ? '0 1em 2em rgba(0,0,0,0.06)' : resting,
        transition: 'box-shadow 150ms ease-out',
      }}
    >
      {children}
    </button>
  )
}

/** One of the four arrows around the dial, placed on the ring's axis. */
function DialKey({ position, onPress }: { position: 'up' | 'down' | 'left' | 'right'; onPress: () => void }) {
  const inset: React.CSSProperties =
    position === 'up'
      ? { top: 0, left: '50%', transform: 'translateX(-50%)' }
      : position === 'down'
        ? { bottom: 0, left: '50%', transform: 'translateX(-50%)' }
        : position === 'left'
          ? { left: 0, top: '50%', transform: 'translateY(-50%)' }
          : { right: 0, top: '50%', transform: 'translateY(-50%)' }

  const capitalised = position[0].toUpperCase() + position.slice(1)

  return (
    <button
      type="button"
      aria-label={capitalised}
      onClick={onPress}
      className="key-flat absolute flex items-center justify-center rounded-full"
      style={{ width: '74em', height: '74em', ...inset }}
    >
      <Triangle width={11} height={8} direction={position} className="fill-glyph" />
    </button>
  )
}

/** A 76×148 pill holding two keys with a dot between them. */
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
  return (
    <div className="flex flex-col items-center" style={{ gap: '10em' }}>
      <div
        role="group"
        aria-label={label}
        className="flex flex-col items-center justify-between bg-surface"
        style={{
          width: '76em',
          height: '148em',
          borderRadius: '38em',
          boxShadow: '0 2em 6em rgba(0,0,0,0.08)',
          padding: '18em 0',
        }}
      >
        <button
          type="button"
          aria-label={top.label}
          onClick={top.onPress}
          className="key-flat flex items-center justify-center rounded-full"
          style={{ width: '44em', height: '44em' }}
        >
          {top.node}
        </button>
        <span className="rounded-full bg-border" style={{ width: '3em', height: '3em' }} aria-hidden="true" />
        <button
          type="button"
          aria-label={bottom.label}
          onClick={bottom.onPress}
          className="key-flat flex items-center justify-center rounded-full"
          style={{ width: '44em', height: '44em' }}
        >
          {bottom.node}
        </button>
      </div>
      <span className="micro-s text-muted" style={{ fontSize: '9em' }}>
        {caption}
      </span>
    </div>
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
