import { withContentlayer } from 'next-contentlayer';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        pathname: '/powerfam/voti-blog-nextjs/**',
      },
    ],
  },
};

export default withContentlayer(nextConfig);