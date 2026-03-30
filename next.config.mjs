/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow all image domains for the portfolio images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
