import Link from 'next/link'
import { Container } from './ui'
import { footer, site } from '@/lib/content'

export function Footer() {
  return (
    <footer className="border-t border-border">
      <Container>
        <div className="flex flex-col gap-8 py-12 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif-display text-[1.375rem] leading-none text-ink">{site.name}</span>
              <span className="micro-s text-muted">{site.wordmark}</span>
            </div>
            <p className="measure-narrow mt-4 text-[0.8125rem] leading-relaxed text-muted">{footer.note}</p>
            <a
              href={`mailto:${site.email}`}
              className="micro-l link-quiet mt-5 inline-block text-ink"
            >
              {site.email}
            </a>
          </div>

          <nav aria-label="Legal">
            <ul className="flex flex-col gap-3 sm:items-end">
              {footer.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="micro-l link-quiet text-muted hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="micro-s pt-2 text-muted">© {site.year}</li>
            </ul>
          </nav>
        </div>
      </Container>
    </footer>
  )
}
