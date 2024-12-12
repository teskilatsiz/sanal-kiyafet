/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com', 'st2.depositphotos.com', 'i.hizliresim.com'],
  },
  experimental: {
    esmExternals: "loose", // This will help with the framer-motion issue
  },
}

module.exports = nextConfig

