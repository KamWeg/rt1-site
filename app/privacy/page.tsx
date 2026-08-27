import type { Metadata } from 'next'
import { DocPage } from '@/components/DocPage'
import { privacyDoc } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Privacy policy',
  description: 'RT 1 collects no personal data. This policy explains what that means in practice, for the app and for this site.',
  alternates: { canonical: '/privacy' },
}

export default function Page() {
  return <DocPage doc={privacyDoc} />
}
