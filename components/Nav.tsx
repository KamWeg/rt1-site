import Link from 'next/link'
import { Container } from './ui'
import { nav, site } from '@/lib/content'

/**
 * Minimal navigation: logotype left, links and one call to action right,
 * a hairline underneath. It sticks to the top on a solid background —
 * translucency would put a blur behind the serif and soften it.
 */
export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-baseline gap-2" aria-label={`${site.name} home`}>
            <span className="font-serif-display text-[1.375rem] leading-none text-ink">{site.name}</span>
            {/* Accent 1 of 3 */}
            <span className="micro-s text-accent">{site.wordmark}</span>
          </Link>

          <nav aria-label="Primary" className="flex items-center gap-6 sm:gap-8">
            <ul className="hidden items-center gap-6 sm:flex sm:gap-8">
              {nav.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="micro-l link-quiet text-muted hover:text-ink">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <Link
              href="/support"
              className="micro-l rounded-full border border-ink px-4 py-2.5 text-ink transition-colors duration-150 hover:bg-ink hover:text-on-dark"
            >
              {nav.cta}
            </Link>
          </nav>
        </div>
      </Container>
    </header>
  )
}
