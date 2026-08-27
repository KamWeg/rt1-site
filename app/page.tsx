import Link from 'next/link'
import { Container, Section, SectionHead } from '@/components/ui'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'
import { Remote } from '@/components/Remote'
import { Reveal } from '@/components/Reveal'
import { TvIcon, Triangle } from '@/components/icons'
import {
  faq,
  features,
  hero,
  howItWorks,
  philosophy,
  privacy,
  site,
  supported,
} from '@/lib/content'

export default function Home() {
  return (
    <>
      <Reveal />
      <Nav />

      <main id="main">
        {/* ── Hero ─────────────────────────────────────────────────────
            On a wide screen this is deliberately one screenful: the section
            takes the viewport less the nav, centres its contents, and the
            remote scales itself down to whatever height is left (see
            `.remote-fit`). Below that it simply stacks and scrolls. */}
        <section className="px-0 pb-20 pt-10 sm:pb-28 sm:pt-14 lg:flex lg:min-h-[calc(100svh-4rem)] lg:items-center lg:py-8">
          <Container>
            <div className="grid items-center gap-14 lg:grid-cols-[1fr_minmax(280px,360px)] lg:gap-16">
              <div className="intro">
                <p className="micro-s text-muted">{hero.eyebrow}</p>

                <h1 className="mt-6">
                  <span className="rise-mask">
                    <span className="font-serif-display text-logo leading-[0.86] tracking-[-0.03em] text-ink">
                      {site.name}
                    </span>
                  </span>
                  <span className="sr-only">— {site.tagline}</span>
                </h1>

                <p aria-hidden="true" className="mt-4">
                  <span className="rise-mask">
                    <span className="font-serif-display text-display leading-[1.02] tracking-[-0.02em] text-ink">
                      {site.tagline}
                    </span>
                  </span>
                </p>

                <p className="measure text-lead mt-7 leading-[1.55] text-muted">{hero.lede}</p>

                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                  {/* Not a link: the app is not on the store yet, and a button
                      that goes nowhere is worse than one that says so. */}
                  <span className="micro-l inline-flex items-center gap-3 rounded-full bg-dark px-6 py-4 text-on-dark">
                    <PlayMark />
                    {hero.status.label}
                  </span>
                  <Link href="/support" className="micro-l link-quiet text-ink">
                    Ask to be told when it ships
                  </Link>
                </div>

                <p className="micro-s mt-5 text-muted">{hero.status.note}</p>
              </div>

              <div className="intro-late remote-fit lg:pl-4">
                <Remote idleLabel={hero.idle} />
              </div>
            </div>
          </Container>
        </section>

        {/* ── /01 How it works ───────────────────────────────────────── */}
        <Section id="how-it-works">
          <Container>
            <SectionHead
              index={howItWorks.index}
              label={howItWorks.label}
              heading={howItWorks.heading}
              lede={howItWorks.lede}
            />

            <ol className="mt-16 grid border-t border-border md:grid-cols-3">
              {howItWorks.steps.map((step, i) => (
                <li
                  key={step.index}
                  data-reveal
                  style={{ '--reveal-delay': `${i * 90}ms` } as React.CSSProperties}
                  className="border-b border-border py-10 md:border-b-0 md:border-r md:px-8 md:py-12 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
                >
                  <span className="micro-s text-muted">{step.index}</span>
                  <h3 className="font-serif-display text-h3 mt-5 text-ink">{step.title}</h3>
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">{step.body}</p>
                </li>
              ))}
            </ol>
          </Container>
        </Section>

        {/* ── /02 Privacy — the page's only dark panel ───────────────── */}
        <section
          id="privacy"
          data-reveal
          className="crt on-dark py-section text-on-dark"
          style={{ scrollMarginTop: '5rem' }}
        >
          {/* The dark block is a layer of its own so the clip that opens it
              never touches the element the observer is watching. */}
          <span className="crt-screen" aria-hidden="true" />
          <Container className="relative z-[1]">
            <SectionHead
              index={privacy.index}
              label={privacy.label}
              heading={privacy.heading}
              lede={privacy.lede}
              tone="dark"
            />

            <ul
              className="mt-16 grid gap-px border-t border-white/12 sm:grid-cols-2"
              style={{ '--reveal-delay': '260ms' } as React.CSSProperties}
            >
              {privacy.points.map((point, i) => (
                <li
                  key={point.numeral}
                  data-reveal
                  style={{ '--reveal-delay': `${260 + i * 90}ms` } as React.CSSProperties}
                  className="border-b border-white/12 py-10 sm:px-8 sm:first:pl-0 sm:[&:nth-child(2n+1)]:pl-0 sm:[&:nth-child(2n)]:pr-0">
                  <div className="flex items-baseline gap-4">
                    {/* Accent 3 of 3 — the numerals, as on the channel display */}
                    <span className="font-serif-display text-numeral leading-none tracking-[-0.01em] text-accent">
                      {point.numeral}
                    </span>
                    <h3 className="font-serif-display text-h3 text-on-dark">{point.title}</h3>
                  </div>
                  <p className="measure-narrow mt-5 text-[0.9375rem] leading-relaxed text-on-dark-muted">
                    {point.body}
                  </p>
                </li>
              ))}
            </ul>

            <p data-reveal className="measure mt-14 text-lead leading-[1.55] text-on-dark">
              {privacy.closing}
            </p>
          </Container>
        </section>

        {/* ── /03 Supported televisions ──────────────────────────────── */}
        <Section id="supported" hairline={false}>
          <Container>
            <SectionHead
              index={supported.index}
              label={supported.label}
              heading={supported.heading}
              lede={supported.lede}
            />

            <div className="mt-16 grid gap-16 md:grid-cols-2 md:gap-20">
              <div data-reveal>
                <h3 className="micro-s border-b border-border pb-4 text-muted">{supported.readyLabel}</h3>
                <ul>
                  {supported.ready.map((tv) => (
                    <li key={tv.brand} className="flex items-center gap-4 border-b border-border py-6">
                      <TvIcon size={20} className="shrink-0 stroke-ink" />
                      <div className="flex-1">
                        <p className="font-serif-display text-[1.0625rem] text-ink">
                          {tv.brand} <span className="text-muted">{tv.platform}</span>
                        </p>
                        <p className="micro-s mt-2 text-muted">{tv.detail}</p>
                      </div>
                      <span
                        className="size-2 shrink-0 rounded-full bg-[var(--color-fastext-green)]"
                        aria-hidden="true"
                      />
                    </li>
                  ))}
                </ul>
              </div>

              <div data-reveal>
                <h3 className="micro-s border-b border-border pb-4 text-muted">{supported.soonLabel}</h3>
                <ul>
                  {supported.soon.map((tv) => (
                    <li key={tv.brand} className="flex items-center gap-4 border-b border-border py-6">
                      <TvIcon size={20} className="shrink-0 stroke-border" />
                      <div className="flex-1">
                        <p className="font-serif-display text-[1.0625rem] text-muted">
                          {tv.brand} <span>{tv.platform}</span>
                        </p>
                      </div>
                      <span className="size-2 shrink-0 rounded-full bg-border" aria-hidden="true" />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </Section>

        {/* ── /04 Design philosophy ──────────────────────────────────── */}
        <Section id="design">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20">
              <SectionHead index={philosophy.index} label={philosophy.label} heading={philosophy.heading} />
              <div data-reveal className="measure">
                {philosophy.body.map((paragraph, i) => (
                  <p
                    key={i}
                    className={`text-lead leading-[1.62] text-ink ${i === 0 ? '' : 'mt-6'}`}
                  >
                    {paragraph}
                  </p>
                ))}
                <p className="micro-s mt-10 border-t border-border pt-6 leading-[1.8] text-muted">
                  {philosophy.credit}
                </p>
              </div>
            </div>
          </Container>
        </Section>

        {/* ── /05 Features ───────────────────────────────────────────── */}
        <Section id="features">
          <Container>
            <SectionHead
              index={features.index}
              label={features.label}
              heading={features.heading}
              lede={features.lede}
            />

            <div className="mt-16" data-reveal>
              <table className="w-full border-collapse text-left">
                <caption className="sr-only">
                  Features available in the free version compared with PRO
                </caption>
                <thead>
                  <tr className="border-b border-ink">
                    <th scope="col" className="micro-s py-4 pr-4 font-medium text-muted">
                      Capability
                    </th>
                    <th scope="col" className="micro-s w-20 py-4 text-right font-medium text-ink sm:w-28">
                      {features.columns.free}
                    </th>
                    <th scope="col" className="micro-s w-20 py-4 text-right font-medium text-ink sm:w-28">
                      {features.columns.pro}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {features.rows.map((row, i) => (
                    <tr
                      key={row.name}
                      className="border-b border-border"
                      style={{ '--check-delay': `${i * 55}ms` } as React.CSSProperties}
                    >
                      <th
                        scope="row"
                        className="py-5 pr-4 text-[0.9375rem] font-normal leading-snug text-ink"
                      >
                        {row.name}
                      </th>
                      <td className="py-5 text-right align-middle">
                        <Availability included={row.free} />
                      </td>
                      <td className="py-5 text-right align-middle">
                        <Availability included={row.pro} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="micro-s mt-6 text-muted">{features.proNote}</p>
            </div>
          </Container>
        </Section>

        {/* ── /06 FAQ ────────────────────────────────────────────────── */}
        <Section id="faq">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-20">
              <SectionHead index={faq.index} label={faq.label} heading={faq.heading} />

              <div data-reveal className="border-t border-border">
                {faq.items.map((item) => (
                  <details key={item.q} className="group border-b border-border">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                      <span className="font-serif-display text-h3 leading-snug text-ink">{item.q}</span>
                      <span
                        className="mt-2 shrink-0 transition-transform duration-200 group-open:rotate-90"
                        aria-hidden="true"
                      >
                        <Triangle width={10} height={7} direction="right" className="fill-muted" />
                      </span>
                    </summary>
                    <p className="answer measure pb-8 text-[0.9375rem] leading-relaxed text-muted">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </>
  )
}

/* ── Small parts ───────────────────────────────────────────────────────── */

/** Included / not included, drawn rather than typed. */
function Availability({ included }: { included: boolean }) {
  if (!included) {
    return (
      <>
        <span className="sr-only">Not included</span>
        <span
          className="ml-auto block h-px w-3 bg-border"
          aria-hidden="true"
        />
      </>
    )
  }
  return (
    <>
      <span className="sr-only">Included</span>
      <svg
        width="14"
        height="11"
        viewBox="0 0 14 11"
        aria-hidden="true"
        focusable="false"
        className="check ml-auto block stroke-ink"
      >
        <path
          d="M1 5.6 5 9.5 13 1.5"
          pathLength={1}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </>
  )
}

/** The Play store triangle, drawn to match the app's arrow geometry. */
function PlayMark() {
  return <Triangle width={9} height={10} direction="right" className="fill-[#F5F4F0]" />
}
