'use client'

import { useEffect } from 'react'

/**
 * Scroll reveal for anything marked `data-reveal`.
 *
 * The elements start visible in the stylesheet and are only hidden here,
 * once this script has run — so if it never runs, or JavaScript is off, the
 * page reads normally instead of being blank. Elements already on screen at
 * load are shown immediately rather than animated in.
 */
export function Reveal() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (targets.length === 0) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reduced.matches || !('IntersectionObserver' in window)) return

    const viewportHeight = window.innerHeight
    const offscreen = targets.filter((el) => el.getBoundingClientRect().top > viewportHeight * 0.9)
    offscreen.forEach((el) => el.classList.add('reveal-armed'))

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // A fast scroll can carry an element from below the viewport to
          // above it inside a single frame. The observer then reports it as
          // *not* intersecting, and waiting for `isIntersecting` would leave
          // it hidden for good — so anything now above the fold is revealed
          // outright.
          const passed = entry.boundingClientRect.bottom < 0
          if (!entry.isIntersecting && !passed) continue
          entry.target.classList.add('reveal-in')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
    )

    offscreen.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return null
}
