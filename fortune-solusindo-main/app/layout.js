import './globals.css';

export const metadata = {
  title: 'Fortune Solusindo — Solusi Bisnis Terintegrasi',
  description:
    'Fortune Solusindo — mitra strategis penyedia mesin fotokopi, digital printing, dan kontrak servis di Sidoarjo & Surabaya.',
  icons: { icon: '/images/logo-fortune.jpg' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
        <style>{`
          body { font-family: 'Inter', sans-serif; }
          h1,h2,h3,h4 { font-family: 'Space Grotesk', sans-serif; }
          .font-mono-label, .eyebrow { font-family: 'IBM Plex Mono', monospace; }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
