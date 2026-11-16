export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://srilanka-vehicle-transfer.vercel.app';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
