'use client'

import { useEffect, useRef } from 'react'

/**
 * A heading whose lines rise into place from behind their own baseline.
 *
 * This is the one piece of motion on the site that is doing more than
 * fading: it is what makes a serif headline feel set rather than pasted on.
 * The mechanics are the same as the GSAP + SplitType arrangement these
 * sites are usually built with, done natively — the whole thing is under a
 * hundred lines and adds nothing to the bundle worth measuring.
 *
 * The text is server-rendered as ordinary text, so it is in the HTML for
 * search engines and readable with JavaScript off. The split happens on
 * mount and is redone whenever the element's width changes, because where
 * the lines break depends entirely on how wide it is.
 */

const LINE_MS = 900
const LINE_STAGGER = 80
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'

/**
 * Group the words by which line they ended up on.
 *
 * Each word is measured after the browser has laid it out, so this reflects
 * the real break points — including hyphenation-free wraps and `text-wrap:
 * balance`, which no amount of character counting would predict.
 */
function measureLines(host: HTMLElement, text: string): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  if (words.length === 0) return []

  host.textContent = ''
  const probes = words.map((word, i) => {
    const span = document.createElement('span')
    span.textContent = word
    host.appendChild(span)
    if (i < words.length - 1) host.appendChild(document.createTextNode(' '))
    return span
  })

  const lines: string[][] = []
  let lastTop: number | null = null
  probes.forEach((probe, i) => {
    const top = probe.offsetTop
    // A tolerance, because a taller glyph on the line can shift offsetTop
    // by a fraction without starting a new line.
    if (lastTop === null || Math.abs(top - lastTop) > 2) {
      lines.push([])
      lastTop = top
    }
    lines[lines.length - 1].push(words[i])
  })

  return lines.map((line) => line.join(' '))
}

/** Rebuild the element as one masked span per line, and hand them back. */
function buildMasks(host: HTMLElement, lines: string[]): HTMLElement[] {
  host.textContent = ''
  return lines.map((line, i) => {
    const mask = document.createElement('span')
    mask.className = 'line-mask'
    const inner = document.createElement('span')
    inner.className = 'line-inner'
    // Each line is its own block, so without a trailing space the words
    // either side of a break run together for anything reading the text
    // rather than looking at it — a screen reader, or a copy and paste.
    // A trailing space collapses visually and costs nothing.
    inner.textContent = i < lines.length - 1 ? `${line} ` : line
    mask.appendChild(inner)
    host.appendChild(mask)
    return inner
  })
}

export function SplitLines({
  as: Tag = 'h2',
  text,
  className,
  id,
}: {
  as?: 'h1' | 'h2' | 'h3'
  text: string
  className?: string
  id?: string
}) {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const host = ref.current
    if (!host) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduced.matches || typeof host.animate !== 'function' || !('IntersectionObserver' in window)) {
      return
    }

    let revealed = false
    let width = host.getBoundingClientRect().width

    const split = () => {
      const inners = buildMasks(host, measureLines(host, text))
      if (revealed) return
      for (const inner of inners) inner.style.transform = 'translateY(110%)'
      return inners
    }

    let inners = split() ?? []

    const reveal = () => {
      if (revealed) return
      revealed = true
      inners.forEach((inner, i) => {
        inner.style.transform = ''
        inner.animate(
          [{ transform: 'translateY(110%)' }, { transform: 'translateY(0)' }],
          { duration: LINE_MS, delay: i * LINE_STAGGER, easing: EASE, fill: 'backwards' },
        )
      })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // As in Reveal.tsx: a fast scroll can carry the heading past the
          // viewport inside one frame, which reports as *not* intersecting.
          if (!entry.isIntersecting && entry.boundingClientRect.bottom > 0) continue
          reveal()
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 },
    )
    observer.observe(host)

    // Line breaks move when the column does, so the split is redone on a
    // width change — and only on a width change, since a height change
    // cannot alter where a line wraps.
    const resize = new ResizeObserver(() => {
      const next = host.getBoundingClientRect().width
      if (Math.abs(next - width) < 1) return
      width = next
      const rebuilt = buildMasks(host, measureLines(host, text))
      inners = rebuilt
      if (!revealed) for (const inner of rebuilt) inner.style.transform = 'translateY(110%)'
    })
    resize.observe(host)

    return () => {
      observer.disconnect()
      resize.disconnect()
      host.textContent = text
    }
  }, [text])

  return (
    <Tag ref={ref} id={id} className={className}>
      {text}
    </Tag>
  )
}
