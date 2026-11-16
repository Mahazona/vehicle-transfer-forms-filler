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
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
