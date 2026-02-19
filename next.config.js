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
  // Base path for IPFS/deployed environments
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // Asset prefix for IPFS
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',
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
