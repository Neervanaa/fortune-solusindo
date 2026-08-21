/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
    ],
  },
  async redirects() {
    return [
      // Preserve old PHP-style URLs from the Rumahweb site
      { source: '/berita/artikel', destination: '/berita', permanent: false },
    ];
  },
};

export default nextConfig;
