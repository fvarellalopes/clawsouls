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
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
          // Note: DiceBear SVGs are loaded directly,
      },
    ],
  },
  // Externalize native modules for server-side
  serverExternalPackages: ['better-sqlite3'],
  // Enable React strict mode for catching re-render issues
  reactStrictMode: true,
  // Compress responses
  compress: true,
  // Optimize production builds
  productionBrowserSourceMaps: false,
  // Experimental optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'zustand'],
  },
};

module.exports = withBundleAnalyzer(withPWA(withNextIntl(nextConfig)));
