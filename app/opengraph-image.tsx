import { ImageResponse } from 'next/og'
import { site } from '@/lib/content'

export const alt = `${site.name} — ${site.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/** Required by `output: export` — the card is rendered once, at build time. */
export const dynamic = 'force-static'

/**
 * Fetch one Google font as a TrueType file.
 *
 * The stylesheet is requested with an old user agent, which makes Google
 * answer with `.ttf` rather than `.woff2` — satori cannot read woff2. This
 * runs at build time only, and `next/font` in the layout already requires
 * Google Fonts to be reachable during the build, so it adds no new
 * dependency at request time.
 */
async function googleFont(family: string, axis = ''): Promise<ArrayBuffer> {
  const query = family.replace(/ /g, '+') + (axis ? `:${axis}` : '')
  const css = await fetch(`https://fonts.googleapis.com/css2?family=${query}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.1)' },
  }).then((r) => r.text())

  const url = css.match(/https:\/\/[^)]+\.ttf/)?.[0]
  if (!url) throw new Error(`No TrueType file offered for ${family}`)
  return fetch(url).then((r) => r.arrayBuffer())
}

/**
 * The share card, built at compile time: the logotype lockup on the page's
 * own background, with the power ring as the single accent — the same three
 * elements as the hero, in the same order.
 */
export default async function OpenGraphImage() {
  const [serif, sans] = await Promise.all([
    googleFont('Instrument Serif'),
    googleFont('Archivo Narrow', 'wght@500'),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#ECEAE5',
          padding: '72px 80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div
            style={{
              display: 'flex',
              fontFamily: 'Archivo Narrow',
              fontSize: 20,
              letterSpacing: 3.4,
              color: '#6B6862',
            }}
          >
            WI-FI REMOTE CONTROL
          </div>

          {/* Power ring — the one accent, drawn to the app's geometry */}
          <svg width="72" height="72" viewBox="0 0 72 72">
            <circle cx="36" cy="36" r="36" fill="#E8551E" />
            <path
              d="M45.26 22.9a15.5 15.5 0 1 1-18.52 0"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <rect x="34.5" y="17" width="3" height="13" rx="1.5" fill="#FFFFFF" />
          </svg>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 22 }}>
            <div
              style={{
                display: 'flex',
                fontFamily: 'Instrument Serif',
                fontSize: 190,
                lineHeight: 0.85,
                letterSpacing: -5,
                color: '#1C1C1A',
              }}
            >
              RT 1
            </div>
            <div
              style={{
                display: 'flex',
                fontFamily: 'Archivo Narrow',
                fontSize: 26,
                letterSpacing: 4,
                color: '#E8551E',
                paddingBottom: 12,
              }}
            >
              REMOTE
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              fontFamily: 'Instrument Serif',
              fontSize: 62,
              color: '#1C1C1A',
              marginTop: 26,
            }}
          >
            {site.tagline}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid #D6D3CD',
            paddingTop: 26,
            fontFamily: 'Archivo Narrow',
            fontSize: 19,
            letterSpacing: 3,
            color: '#6B6862',
          }}
        >
          <div style={{ display: 'flex' }}>NO ACCOUNT · NO CLOUD · NO DATA COLLECTION</div>
          <div style={{ display: 'flex' }}>SAMSUNG · LG</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Instrument Serif', data: serif, style: 'normal', weight: 400 },
        { name: 'Archivo Narrow', data: sans, style: 'normal', weight: 500 },
      ],
    },
  )
}
