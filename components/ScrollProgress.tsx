'use client'

import { useEffect, useRef } from 'react'

/**
 * A hairline under the navigation that fills as the page is read.
 *
 * It replaces nothing and explains nothing — it is simply the one piece of
 * ambient state the page has, drawn in the same 1px weight as every other
 * rule on it. Reading is done off `scrollY` inside a frame callback, so a
 * fast scroll costs one style write per frame rather than one per event.
 */
export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = bar.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0

    const draw = () => {
      frame = 0
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0
      el.style.transform = `scaleX(${progress})`
    }

    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(draw)
    }

    draw()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-[-1px] h-px overflow-hidden"
    >
      <div ref={bar} className="h-full origin-left bg-ink" style={{ transform: 'scaleX(0)' }} />
    </div>
  )
}
