/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Produce a self-contained output directory (.next/standalone + .next/static)
  // so the production Docker image only needs to copy those two directories
  // rather than the full node_modules tree.
  output: 'standalone',

  webpack: (config, { isServer }) => {
    // MediaPipe and Whisper.js are browser-only; exclude them from the
    // server-side bundle to prevent native-module resolution errors.
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        '@mediapipe/face_mesh',
        '@mediapipe/hands',
        '@mediapipe/pose',
        '@mediapipe/camera_utils',
        '@mediapipe/drawing_utils',
        'whisper',
        'web-audio-api',
      ];
    }

    // worker-loader is handled by Next.js built-in worker support; suppress
    // the webpack warning for .wasm files used by MediaPipe.
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };

    return config;
  },
};

module.exports = nextConfig;
