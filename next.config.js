/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Critical fixes for workStore issue
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin'],
    forceSwcTransforms: true,
    // Disable problematic features that cause workStore issues
    esmExternals: 'loose',
    // Force static optimization off to prevent workStore conflicts
    optimizePackageImports: false,
  },
  // Ensure proper compilation
  swcMinify: true,
  // Disable trailing slash to prevent routing issues
  trailingSlash: false,
  // Force output to be standalone to avoid workStore conflicts
  output: 'standalone',
  // Disable static optimization that can cause workStore issues
  generateEtags: false,
  // Add headers to help with CORS and caching
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
  // Webpack configuration to prevent workStore issues
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Prevent client-side issues with workStore
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;