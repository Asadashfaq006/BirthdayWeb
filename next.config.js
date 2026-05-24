/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Explicitly wire @/ → ./src so Next.js 14 resolves it without
    // depending solely on jsconfig path resolution.
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'),
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
