/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '0.0.0.0',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '0.0.0.0',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Enable the app directory by default in newer Next.js versions
};

module.exports = nextConfig;