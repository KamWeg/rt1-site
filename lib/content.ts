/**
 * Every string on the site. Components import from here and never inline
 * copy, so wording can be revised without touching layout.
 */

export const site = {
  name: 'RT 1',
  wordmark: 'Remote',
  tagline: 'Less, but better',
  description:
    'A Wi-Fi remote for your television. No account, no cloud, no data collection — every command travels across your own network and stops there.',
  url: 'https://rt1-site.vercel.app',
  email: 'hello@rt1.app',
  year: 2026,
} as const

export const nav = {
  links: [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Privacy', href: '#privacy' },
    { label: 'FAQ', href: '#faq' },
  ],
  cta: 'Get RT 1',
} as const

export const hero = {
  eyebrow: 'Wi-Fi remote control',
  lede:
    'RT 1 finds your television on the network you are already on, pairs once, and sends every button press straight to it.',
  status: {
    label: 'Android — coming soon',
    note: 'iOS to follow',
  },
  /** Read-out under the interactive remote, before anything is pressed */
  idle: 'Try it',
} as const

export const howItWorks = {
  index: '/01',
  label: 'How it works',
  heading: 'Three steps, then never again',
  lede:
    'RT 1 works over your Wi-Fi network. It needs no infrared, no Bluetooth and no line of sight — you can point the phone at the floor and the television still answers.',
  steps: [
    {
      index: '01',
      title: 'Discover',
      body:
        'Open the app and it broadcasts a search across the local network using SSDP and mDNS — the same protocols your television already answers for AirPlay and screen casting. Sets appear as they reply, usually within a couple of seconds.',
    },
    {
      index: '02',
      title: 'Pair',
      body:
        'Tap your set. It shows a permission prompt on screen; approve it once with the remote you still own. RT 1 keeps the resulting token on your phone, and the prompt never comes back.',
    },
    {
      index: '03',
      title: 'Control',
      body:
        'From then on the app is the remote. Directional pad, volume, channels, transport, inputs, menu — each press becomes a single message sent directly to the television, with nothing in between.',
    },
  ],
} as const

export const privacy = {
  index: '/02',
  label: 'Privacy',
  heading: 'Nothing leaves your network',
  lede:
    'Most remote apps route your presses through a server so they can count them. RT 1 has no server to route them to.',
  /** Rendered like the channel display in the app: numeral + label + line */
  points: [
    {
      numeral: '01',
      title: 'No account',
      body: 'There is nothing to sign up for. Install the app and it works.',
    },
    {
      numeral: '02',
      title: 'No cloud',
      body:
        'Commands go from your phone to your television over the local network. They never reach the internet.',
    },
    {
      numeral: '03',
      title: 'No data collection',
      body:
        'No analytics, no crash reporting, no advertising identifiers, no telemetry of any kind.',
    },
    {
      numeral: '04',
      title: 'No consent banner',
      body:
        'This site sets no cookies and loads no trackers, which is why you were not asked about any.',
    },
  ],
  closing:
    'The only thing RT 1 stores is the pairing token your television issued, and it stores it on your phone. Uninstall the app and it is gone.',
} as const

export const supported = {
  index: '/03',
  label: 'Supported televisions',
  heading: 'Two platforms at launch',
  lede:
    'Samsung and LG cover the majority of network-controllable sets sold in the last decade. More are in progress.',
  ready: [
    {
      brand: 'Samsung',
      platform: 'Tizen',
      detail: '2016 and later',
    },
    {
      brand: 'LG',
      platform: 'webOS',
      detail: '2016 and later',
    },
  ],
  soon: [
    { brand: 'Sony', platform: 'Google TV' },
    { brand: 'Philips', platform: 'Android TV' },
    { brand: 'Roku', platform: 'Roku TV' },
    { brand: 'Hisense', platform: 'VIDAA' },
  ],
  readyLabel: 'Supported',
  soonLabel: 'In progress',
} as const

export const philosophy = {
  index: '/04',
  label: 'Design',
  heading: 'A remote should disappear',
  /** Written as an argument about this product, not as a quotation of Rams. */
  body: [
    'The remote controls sold with televisions have somewhere near fifty buttons. Most people use six. The other forty-four exist because adding a button is cheaper than deciding which ones matter, and because a crowded remote looks like a generous one on a shelf.',
    'RT 1 starts from the opposite position. The directional pad is the largest thing on the screen because it is what your thumb reaches for first. Volume and channel sit under the hand as physical rockers would. Everything that is used rarely is one layer away, and everything that is never used is not there at all.',
    'The restraint is not decorative. A control surface you can operate without looking is a control surface with few enough elements to remember — so the discipline of leaving things out is the feature, not the styling around it.',
    'Colour follows the same rule. The interface is a warm grey with one orange, and the orange is reserved for the power key and the live channel readout. When almost nothing is coloured, the thing that is coloured means something.',
  ],
  credit: 'In the tradition of Dieter Rams and Braun, and of the Apple that read him closely.',
} as const

export const features = {
  index: '/05',
  label: 'Features',
  heading: 'Free, and a little more',
  lede:
    'Everything needed to replace the remote in your sofa is free. PRO adds the parts that go beyond it.',
  columns: { free: 'Free', pro: 'PRO' },
  proNote: 'Coming in v1.1',
  rows: [
    { name: 'Directional pad, OK and back', free: true, pro: true },
    { name: 'Volume and channel rockers', free: true, pro: true },
    { name: 'Playback and transport keys', free: true, pro: true },
    { name: 'Network discovery (SSDP + mDNS)', free: true, pro: true },
    { name: 'One-time pairing, token kept on device', free: true, pro: true },
    { name: 'Multiple saved televisions', free: true, pro: true },
    { name: 'Direct channel entry', free: true, pro: true },
    { name: 'Teletext fastext keys', free: true, pro: true },
    { name: 'Gesture touchpad', free: false, pro: true },
    { name: 'On-screen keyboard for TV text fields', free: false, pro: true },
    { name: 'Home screen and lock screen widgets', free: false, pro: true },
  ],
} as const

export const faq = {
  index: '/06',
  label: 'Questions',
  heading: 'Before you ask',
  items: [
    {
      q: 'Will it work with my television?',
      a: 'If it is a Samsung running Tizen or an LG running webOS, made from roughly 2016 onwards, yes. Those sets expose a network control interface that RT 1 speaks. Sony, Philips, Roku and Hisense are in progress. Older sets that only accept infrared cannot be controlled by a phone without extra hardware, and RT 1 does not pretend otherwise.',
    },
    {
      q: 'Do my phone and television need to be on the same Wi-Fi?',
      a: 'Yes. That is the whole design. RT 1 discovers and controls the television over your local network, so both devices must be on it. If your router separates a guest network from the main one, or isolates wireless clients from each other, the television will not appear — putting both on the same network solves it.',
    },
    {
      q: 'Do you collect any data about me?',
      a: 'No. There is no account, no analytics package, no crash reporter and no advertising identifier. The app has no server to send anything to. The only thing it stores is the pairing token your television issued, held locally on your phone and deleted when you uninstall.',
    },
    {
      q: 'Why can I not use it from outside the house?',
      a: 'Because making that work would mean putting a server between your phone and your television, and that server would see every command. Remote-over-internet control is the single feature most responsible for these apps collecting data. We would rather not have it than build the thing that requires it.',
    },
    {
      q: 'When is the iOS version coming?',
      a: 'After Android. The control protocols are identical, but iOS restricts local network discovery more tightly, so it needs its own testing pass rather than a straight port. There is no date to give yet, and we would rather say that than invent one.',
    },
    {
      q: 'Does it need infrared or a Bluetooth pairing?',
      a: 'Neither. Phones with an infrared emitter are rare now, and Bluetooth remote pairing is inconsistent between manufacturers. RT 1 uses the network interface the television already runs, which means no line of sight, no aiming, and no re-pairing when you change rooms.',
    },
  ],
} as const

export const footer = {
  links: [
    { label: 'Privacy policy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Support', href: '/support' },
  ],
  note: 'Made for televisions, on the network they are already on.',
} as const
