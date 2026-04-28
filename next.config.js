/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {},
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  
  // CDN Configuration
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://cdn.synova.ai' 
    : undefined,
    
  // Image optimization
  images: {
    domains: ['cdn.synova.ai'],
    loader: 'custom',
    loaderFile: './lib/image-loader.js',
  },
  
  // Static file caching
  generateEtags: false,
  
  // Compression
  compress: true,
  
  // Security headers
  async headers() {
    const headers = [];
    
    if (process.env.NODE_ENV === 'production') {
      headers.push({
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      });
      
      headers.push({
        source: '/uploads/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      });
    }
    
    return headers;
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        canvas: false,
      };
    }
    return config;
  },
}

module.exports = nextConfig
