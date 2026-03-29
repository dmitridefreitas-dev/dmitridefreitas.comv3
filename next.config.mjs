/** @type {import('next').NextConfig} */
const nextConfig = {
transpilePackages: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
