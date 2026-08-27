import type { Metadata } from 'next'
import { DocPage } from '@/components/DocPage'
import { termsDoc } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Terms of use',
  description: 'The licence, compatibility expectations and liability terms for the RT 1 application.',
  alternates: { canonical: '/terms' },
}

export default function Page() {
  return <DocPage doc={termsDoc} />
}
