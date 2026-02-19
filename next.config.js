/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require('next-intl/plugin');
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Externalize native modules for server-side
  serverExternalPackages: ['better-sqlite3'],
  // Disable server-side features for static export
  trailingSlash: true,
};

module.exports = withBundleAnalyzer(withPWA(withNextIntl(nextConfig)));
