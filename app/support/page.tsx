import type { Metadata } from 'next'
import { DocPage } from '@/components/DocPage'
import { supportDoc } from '@/lib/legal'

export const metadata: Metadata = {
  title: 'Support',
  description: 'How to reach us, and fixes for the problems that come up most often.',
  alternates: { canonical: '/support' },
}

export default function Page() {
  return <DocPage doc={supportDoc} />
}
