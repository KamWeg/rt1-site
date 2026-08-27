/**
 * Icons, drawn as geometry rather than typed as glyphs.
 *
 * The maths is ported from the app's src/components/icons/* so the shapes
 * on the site and the shapes under your thumb are literally the same:
 * triangles with rounded vertices, 10×2 bars for plus/minus, and a power
 * ring broken at the top with a bar rising through the gap.
 */

type Direction = 'up' | 'down' | 'left' | 'right'
type Point = { x: number; y: number }

/**
 * Sizes are given as plain numbers meaning design pixels, and rendered in
 * whichever unit the call site asks for.
 *
 * The remote scales itself by setting a font-size below 1px and expressing
 * every dimension in `em`; an icon drawn at a fixed pixel size would stay
 * put while the key around it shrank. So inside the remote the icons take
 * `unit="em"` and shrink with everything else. Everywhere else on the page
 * the surrounding font-size is a normal 16px, where `em` would be wildly
 * wrong, so the default stays `px`.
 */
export type SizeUnit = 'px' | 'em'

/** Figma's radius steps, keyed by the arrow's width. */
function radiusForWidth(width: number): number {
  if (width >= 12) return 1
  if (width >= 10) return 0.75
  return 0.4
}

/**
 * Polygon path whose corners are rounded by `r`: each edge is pulled back
 * from the vertex by `r`, and the gap is bridged with a quadratic curve
 * through the original vertex.
 */
function roundedPolygonPath(points: Point[], r: number): string {
  const count = points.length
  const parts: string[] = []

  for (let i = 0; i < count; i++) {
    const prev = points[(i - 1 + count) % count]
    const curr = points[i]
    const next = points[(i + 1) % count]

    const toPrev = { x: prev.x - curr.x, y: prev.y - curr.y }
    const toNext = { x: next.x - curr.x, y: next.y - curr.y }
    const lenPrev = Math.hypot(toPrev.x, toPrev.y)
    const lenNext = Math.hypot(toNext.x, toNext.y)
    // Never cut more than half an edge, or neighbouring corners overlap
    const cut = Math.min(r, lenPrev / 2, lenNext / 2)

    const start = {
      x: curr.x + (toPrev.x / lenPrev) * cut,
      y: curr.y + (toPrev.y / lenPrev) * cut,
    }
    const end = {
      x: curr.x + (toNext.x / lenNext) * cut,
      y: curr.y + (toNext.y / lenNext) * cut,
    }

    parts.push(i === 0 ? `M${start.x} ${start.y}` : `L${start.x} ${start.y}`)
    parts.push(`Q${curr.x} ${curr.y} ${end.x} ${end.y}`)
  }

  parts.push('Z')
  return parts.join(' ')
}

export function Triangle({
  width,
  height,
  direction = 'up',
  className = 'fill-glyph',
  unit = 'px',
}: {
  width: number
  height: number
  direction?: Direction
  className?: string
  unit?: SizeUnit
}) {
  const r = radiusForWidth(width)
  const sideways = direction === 'left' || direction === 'right'
  const boxW = sideways ? height : width
  const boxH = sideways ? width : height

  // Written out per direction rather than rotated — no transform to get wrong
  const points: Record<Direction, Point[]> = {
    up: [
      { x: width / 2, y: 0 },
      { x: width, y: height },
      { x: 0, y: height },
    ],
    down: [
      { x: width / 2, y: height },
      { x: 0, y: 0 },
      { x: width, y: 0 },
    ],
    left: [
      { x: 0, y: width / 2 },
      { x: height, y: width },
      { x: height, y: 0 },
    ],
    right: [
      { x: height, y: width / 2 },
      { x: 0, y: 0 },
      { x: 0, y: width },
    ],
  }

  return (
    <svg
      viewBox={`0 0 ${boxW} ${boxH}`}
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ width: `${boxW}${unit}`, height: `${boxH}${unit}`, flexShrink: 0 }}
    >
      <path d={roundedPolygonPath(points[direction], r)} />
    </svg>
  )
}

/**
 * Power ring: arc radius 10.22, gap ±31° from twelve o'clock, 2px round
 * caps, and a 2×8 bar rising through the gap.
 *
 * The ring is centred in the key. The app's own icon keeps the glyph's
 * bounding box centred instead, which puts the ring about a pixel low
 * because the bar adds mass at the top; here the box is extended downwards
 * to exactly twice the arc centre, so centring the box centres the ring.
 */
export function PowerIcon({
  size = 24,
  className = 'text-white',
  unit = 'px',
}: { size?: number; className?: string; unit?: SizeUnit }) {
  const BOX_W = 24
  const CX = 12
  const CY = 14.28
  /** Twice the arc centre: makes the ring's centre the box's centre. */
  const BOX_H = CY * 2
  const RADIUS = 10.22
  const rad = (31 * Math.PI) / 180
  const dx = RADIUS * Math.sin(rad)
  const dy = RADIUS * Math.cos(rad)

  return (
    <svg
      viewBox={`0 0 ${BOX_W} ${BOX_H}`}
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ width: `${size}${unit}`, height: `${(size * BOX_H) / BOX_W}${unit}`, flexShrink: 0 }}
    >
      <path
        d={`M${CX + dx} ${CY - dy} A${RADIUS} ${RADIUS} 0 1 1 ${CX - dx} ${CY - dy}`}
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />
      <rect x={CX - 1} y={2} width={2} height={8} rx={1} fill="currentColor" />
    </svg>
  )
}

const BAR = 2

export function PlusIcon({
  size = 12,
  className = 'fill-glyph',
  unit = 'px',
}: { size?: number; className?: string; unit?: SizeUnit }) {
  const offset = (size - BAR) / 2
  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ width: `${size}${unit}`, height: `${size}${unit}`, flexShrink: 0 }}
    >
      <rect x={0} y={offset} width={size} height={BAR} rx={1} />
      <rect x={offset} y={0} width={BAR} height={size} rx={1} />
    </svg>
  )
}

export function MinusIcon({
  size = 12,
  className = 'fill-glyph',
  unit = 'px',
}: { size?: number; className?: string; unit?: SizeUnit }) {
  return (
    <svg
      viewBox={`0 0 ${size} ${BAR}`}
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ width: `${size}${unit}`, height: `${BAR}${unit}`, flexShrink: 0 }}
    >
      <rect x={0} y={0} width={size} height={BAR} rx={1} />
    </svg>
  )
}

/** Home key — a rounded square outline, 2px stroke. */
export function StopIcon({
  size = 14,
  className = 'stroke-glyph',
  unit = 'px',
}: { size?: number; className?: string; unit?: SizeUnit }) {
  return (
    <svg
      viewBox="0 0 14 14"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ width: `${size}${unit}`, height: `${size}${unit}`, flexShrink: 0 }}
    >
      <rect x={1} y={1} width={12} height={12} rx={2.5} strokeWidth={2} fill="none" />
    </svg>
  )
}

/** Menu key — three 14×2 bars, 4px apart. */
export function MenuIcon({
  className = 'fill-glyph',
  unit = 'px',
}: { className?: string; unit?: SizeUnit }) {
  return (
    <svg
      viewBox="0 0 14 10"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ width: `14${unit}`, height: `10${unit}`, flexShrink: 0 }}
    >
      <rect x={0} y={0} width={14} height={BAR} rx={1} />
      <rect x={0} y={4} width={14} height={BAR} rx={1} />
      <rect x={0} y={8} width={14} height={BAR} rx={1} />
    </svg>
  )
}

/** Television outline used on the supported-set rows. */
export function TvIcon({ size = 20, className = 'stroke-glyph' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true" focusable="false" className={className}>
      <rect x={1.5} y={3.5} width={17} height={11} rx={2} strokeWidth={1.5} fill="none" />
      <path d="M7 17.25h6" strokeWidth={1.5} strokeLinecap="round" fill="none" />
    </svg>
  )
}
