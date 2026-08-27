import { site } from './content'

export type DocSection = {
  heading: string
  /** Paragraphs; a nested array renders as a bulleted list. */
  body: (string | string[])[]
}

export type Doc = {
  title: string
  intro: string
  updated: string
  sections: DocSection[]
}

const UPDATED = '27 August 2026'

export const privacyDoc: Doc = {
  title: 'Privacy policy',
  updated: UPDATED,
  intro:
    'This policy covers the RT 1 mobile application and this website. It is short because there is little to describe: neither one collects personal data.',
  sections: [
    {
      heading: 'What the app collects',
      body: [
        'Nothing. RT 1 has no account system, no analytics, no crash reporting, no advertising identifiers and no telemetry. It does not contact any server operated by us, because we do not operate one.',
        'The app requests permission to use your local network. That permission exists so it can find and talk to your television. It is not used for anything else.',
      ],
    },
    {
      heading: 'What the app stores on your device',
      body: [
        'RT 1 keeps a small amount of information locally so you do not have to set it up again each time:',
        [
          'The network address and name of each television you have added.',
          'The pairing token your television issued when you approved the connection. This token is created by the television, not by us.',
          'Your preferences, such as which television was last selected.',
        ],
        'This information never leaves your device. It is not backed up to any service by us, and deleting the app deletes it.',
      ],
    },
    {
      heading: 'Where your commands go',
      body: [
        'When you press a key, the app sends a message directly to your television over your local network. The message does not travel over the internet and does not pass through any intermediary. We cannot see which buttons you press, what you watch, or when you watch it — there is no path by which that information could reach us.',
      ],
    },
    {
      heading: 'This website',
      body: [
        'This site sets no cookies and stores nothing in your browser. It loads no analytics, no tag managers, no advertising pixels and no social media embeds. That is why you were not shown a consent banner: there is nothing to consent to.',
        'Web fonts are served from the same origin as the site itself, so loading a page does not tell any third party that you visited.',
        'The site is hosted by Vercel Inc., which as a hosting provider processes standard server request data such as IP addresses for the purpose of delivering the page and protecting the service. We do not have access to an analytics view of that data, and we do not use it.',
      ],
    },
    {
      heading: 'Third parties',
      body: [
        'If you install RT 1 from Google Play, Google processes that installation under its own privacy policy, and we receive only the aggregate, anonymous install and rating counts that Google shows every developer. We share no data with anyone, because we hold none to share.',
      ],
    },
    {
      heading: 'Children',
      body: [
        'RT 1 is not directed at children and collects no data from anyone, including children.',
      ],
    },
    {
      heading: 'Your rights',
      body: [
        'Data protection law gives you rights of access, correction, deletion and portability over personal data held about you. We hold none, so there is nothing for us to produce or erase. Everything the app stores is on your device and under your control: removing a television in the app deletes its entry and its pairing token, and uninstalling the app removes all of it at once.',
      ],
    },
    {
      heading: 'Changes',
      body: [
        'If this policy changes in a way that affects what is collected, the change will be published here with a new date before it takes effect. Given the design of the product, we do not anticipate that happening.',
      ],
    },
    {
      heading: 'Contact',
      body: [`Questions about this policy can be sent to ${site.email}.`],
    },
  ],
}

export const termsDoc: Doc = {
  title: 'Terms of use',
  updated: UPDATED,
  intro:
    'These terms govern your use of the RT 1 application and this website. Installing or using the app means you accept them.',
  sections: [
    {
      heading: 'The licence',
      body: [
        'You are granted a personal, non-exclusive, non-transferable licence to install and use RT 1 on devices you own or control, for private, non-commercial purposes. The app and its design remain our property; nothing here transfers ownership of them to you.',
        'You may not decompile or reverse engineer the app except to the extent that applicable law expressly permits it, and you may not redistribute it, resell it, or present it as your own work.',
      ],
    },
    {
      heading: 'What the app is for',
      body: [
        'RT 1 sends control commands to televisions on your own local network, using interfaces those televisions already publish. Use it only with televisions you own or are authorised to control. Using it to interfere with equipment belonging to other people is outside the scope of this licence and may be unlawful.',
      ],
    },
    {
      heading: 'Compatibility',
      body: [
        'Support for a television depends on the manufacturer’s network control interface, which the manufacturer can change or remove in a firmware update without notice. We list the models we expect to work and test what we can, but we cannot guarantee that any particular set will work, or will keep working.',
        'RT 1 requires that your phone and your television are on the same local network. It cannot function otherwise, and this is a design decision rather than a limitation we intend to remove.',
      ],
    },
    {
      heading: 'PRO features',
      body: [
        'Some features are offered as a paid upgrade. Where a purchase is made through an app store, that store handles payment, receipts and refunds under its own terms, and any refund request must go to the store rather than to us. Features described as forthcoming are statements of intent, not commitments to a date.',
      ],
    },
    {
      heading: 'No warranty',
      body: [
        'The app is provided as it is, without warranty of any kind, express or implied, including any implied warranty of merchantability, fitness for a particular purpose or non-infringement. We do not warrant that it will be uninterrupted or error free.',
      ],
    },
    {
      heading: 'Limitation of liability',
      body: [
        'To the fullest extent permitted by law, we are not liable for indirect, incidental, special or consequential loss arising out of your use of the app, and our total liability for any claim relating to it is limited to the amount you paid for it.',
        'Nothing in these terms excludes or limits liability that cannot lawfully be excluded, including liability for death or personal injury caused by negligence, or for fraud. If you are a consumer, your statutory rights are unaffected.',
      ],
    },
    {
      heading: 'Ending the licence',
      body: [
        'You may end this licence at any time by uninstalling the app. We may end it if you breach these terms. On termination the licence stops, but the sections on liability and ownership continue to apply.',
      ],
    },
    {
      heading: 'Governing law',
      body: [
        'These terms are governed by Polish law, and the courts of Poland have jurisdiction over any dispute. If you are a consumer resident elsewhere in the European Union, you keep the protection of the mandatory rules of your own country of residence.',
      ],
    },
    {
      heading: 'Contact',
      body: [`Questions about these terms can be sent to ${site.email}.`],
    },
  ],
}

export const supportDoc: Doc = {
  title: 'Support',
  updated: UPDATED,
  intro:
    'RT 1 is made by a small team. There is no ticketing system and no chatbot — write to us and a person reads it.',
  sections: [
    {
      heading: 'Get in touch',
      body: [
        `Email ${site.email}. We usually reply within two working days. If you would like to hear when the app is released, say so and we will write once, at launch, and not again.`,
        'When reporting a problem, the following makes it much faster to diagnose:',
        [
          'The make, model and year of your television.',
          'Your phone model and Android version.',
          'What you expected to happen, and what happened instead.',
          'Whether the television appears during the search, and whether pairing completed.',
        ],
      ],
    },
    {
      heading: 'My television does not appear',
      body: [
        'Almost every case comes down to the two devices not sharing a network. Check that your phone is on the same Wi-Fi as the television and not on a guest network or a separate band that your router keeps isolated.',
        'Some routers have a setting called client isolation, AP isolation or similar, which stops devices on the wireless network from seeing each other. Turning it off makes the television discoverable again.',
        'Televisions with network control switched off in their own settings will not answer. On Samsung the setting sits under general or external device management; on LG it is part of the mobile connection options.',
      ],
    },
    {
      heading: 'Pairing was refused, or the prompt never appeared',
      body: [
        'The permission prompt is shown by the television, not by the app. If it did not appear, the set may already have a stored decision for RT 1 — clearing the device list in the television’s settings and pairing again resolves it.',
        'If you previously declined the prompt, most televisions remember that refusal and will not ask a second time until the entry is removed on the television itself.',
      ],
    },
    {
      heading: 'A key does nothing',
      body: [
        'Not every television implements every command. Where a manufacturer has no equivalent for a key, the command is accepted and ignored by the set. Tell us which key and which model, and we will map it properly.',
      ],
    },
    {
      heading: 'Deleting your data',
      body: [
        'There is nothing held on our side to delete. Removing a television in the app deletes its entry and pairing token; uninstalling the app removes everything it stored.',
      ],
    },
  ],
}
