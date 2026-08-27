import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /**
   * `next dev` and `next build` share .next by default, so running a
   * verification build while the dev server is up replaces the files it is
   * serving and it starts answering 500s. Set BUILD_DIR to build somewhere
   * else — `BUILD_DIR=.next-verify npm run build`. Vercel sets nothing, so
   * its builds are unaffected.
   */
  distDir: process.env.BUILD_DIR || '.next',
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
}

export default nextConfig
