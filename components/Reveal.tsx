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

    /**
     * A fallback for the case where the observer never delivers — it can be
     * starved, and an armed element is invisible until something reveals it.
     *
     * It has to be driven by position, not by a clock. A plain deadline
     * revealed the whole page while the reader was still on the hero, so by
     * the time they scrolled there was nothing left to arrive: the safety
     * net quietly removed the feature it was protecting. This reveals only
     * what has actually come into view, so the result is the same either
     * way and the animation survives.
     */
    let pending = offscreen
    // Throttled on a timestamp rather than a frame. The fallback exists for
    // the case where the browser is not servicing this page normally, and
    // requestAnimationFrame is the first thing to stop in that state — a
    // safety net must not be built out of the thing it is catching.
    let last = 0

    const sweep = () => {
      last = Date.now()
      const limit = window.innerHeight * 0.92
      pending = pending.filter((el) => {
        if (el.getBoundingClientRect().top >= limit) return true
        el.classList.add('reveal-in')
        return false
      })
      if (pending.length === 0) detach()
    }

    const schedule = () => {
      if (Date.now() - last < 80) return
      sweep()
    }

    function detach() {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      document.removeEventListener('visibilitychange', sweep)
    }

    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    // A tab that was hidden gets no frames, so nothing swept while it was
    // away; catch up the moment it comes back.
    document.addEventListener('visibilitychange', sweep)

    return () => {
      detach()
      observer.disconnect()
    }
  }, [])

  return null
}
