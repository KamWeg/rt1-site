import { Container } from './ui'
import { Nav } from './Nav'
import { Footer } from './Footer'
import type { Doc } from '@/lib/legal'

/**
 * Shared shell for the legal pages: the same grid and hairlines as the home
 * page, with the measure pulled in so the text stays readable.
 */
export function DocPage({ doc }: { doc: Doc }) {
  return (
    <>
      <Nav />
      <main id="main">
        <Container>
          <article className="py-20 sm:py-28">
            <header className="border-b border-border pb-12">
              <p className="micro-s text-muted">Updated {doc.updated}</p>
              <h1 className="font-serif-display text-h2 mt-6 max-w-[16ch] leading-[1.08] tracking-[-0.015em] text-ink">
                {doc.title}
              </h1>
              <p className="measure text-lead mt-6 leading-[1.55] text-muted">{doc.intro}</p>
            </header>

            {doc.sections.map((section) => (
              <section key={section.heading} className="border-b border-border py-12">
                <h2 className="font-serif-display text-h3 text-ink">{section.heading}</h2>
                <div className="measure mt-5">
                  {section.body.map((block, i) =>
                    Array.isArray(block) ? (
                      <ul key={i} className="mt-4 flex flex-col gap-3">
                        {block.map((item) => (
                          <li key={item} className="flex gap-3 text-[0.9375rem] leading-relaxed text-muted">
                            <span className="mt-2.5 size-1 shrink-0 rounded-full bg-border" aria-hidden="true" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p
                        key={i}
                        className={`text-[0.9375rem] leading-relaxed text-muted ${i === 0 ? '' : 'mt-4'}`}
                      >
                        {block}
                      </p>
                    ),
                  )}
                </div>
              </section>
            ))}
          </article>
        </Container>
      </main>
      <Footer />
    </>
  )
}
