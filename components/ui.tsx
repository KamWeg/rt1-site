import type { ReactNode } from 'react'
import { SplitLines } from './SplitLines'

/**
 * Layout primitives. Every section on the page is built from these three,
 * which is what keeps the vertical rhythm and the hairlines consistent.
 */

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[1200px] px-gutter ${className}`}>{children}</div>
}

/**
 * A section, separated from the one above by a single full-bleed hairline.
 * Colour blocks are not used as separators anywhere except the dark
 * privacy panel, which is the page's only tonal contrast.
 */
export function Section({
  id,
  children,
  className = '',
  hairline = true,
}: {
  id?: string
  children: ReactNode
  className?: string
  hairline?: boolean
}) {
  return (
    <section
      id={id}
      className={`relative py-section ${className}`}
      style={{ scrollMarginTop: '5rem' }}
    >
      {/* The divider is an element rather than a border so it can draw
          itself across the page as the section arrives. */}
      {hairline ? (
        <span
          data-reveal
          className="draw-x absolute inset-x-0 top-0 block h-px bg-border"
          aria-hidden="true"
        />
      ) : null}
      {children}
    </section>
  )
}

/**
 * The repeating opening of every section: index, label, heading, one lead
 * sentence. The four elements always appear in this order and at these
 * sizes, so a reader learns the pattern once.
 */
export function SectionHead({
  index,
  label,
  heading,
  lede,
  tone = 'light',
  as: Heading = 'h2',
}: {
  index: string
  label: string
  heading: string
  lede?: string
  tone?: 'light' | 'dark'
  as?: 'h2' | 'h3'
}) {
  const muted = tone === 'dark' ? 'text-on-dark-muted' : 'text-muted'
  const ink = tone === 'dark' ? 'text-on-dark' : 'text-ink'

  return (
    <div data-reveal>
      <div className={`flex items-center gap-3 ${muted}`}>
        <span className="micro-s">{index}</span>
        <span className="rule h-px w-6 bg-current opacity-40" aria-hidden="true" />
        <span className="micro-s">{label}</span>
      </div>
      <SplitLines
        as={Heading}
        text={heading}
        className={`font-serif-display text-h2 mt-6 max-w-[24ch] text-balance leading-[1.08] tracking-[-0.015em] ${ink}`}
      />
      {lede ? (
        <p className={`measure text-lead mt-6 leading-[1.55] ${muted}`}>{lede}</p>
      ) : null}
    </div>
  )
}
