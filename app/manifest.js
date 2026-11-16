export default function manifest() {
  return {
    name: 'Sri Lanka Vehicle Transfer Forms Filler (MTA 6A, 6B & MTA 8)',
    short_name: 'DMT Transfer Filler',
    description: 'Auto-fill and print official Sri Lanka Department of Motor Traffic (DMT / RMV) Vehicle Transfer Forms MTA 6A, MTA 6B, and MTA 8.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#1e40af',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/apple-icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/favicon.ico',
        sizes: '48x48 32x32 16x16',
        type: 'image/x-icon',
      },
    ],
  };
}
