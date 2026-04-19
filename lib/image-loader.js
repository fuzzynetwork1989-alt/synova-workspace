// Custom image loader for CDN
export default function imageLoader({ src, width, quality }) {
  // If the image is already from CDN, return as-is
  if (src.startsWith('https://cdn.synova.ai')) {
    return src;
  }
  
  // For local images in development, return as-is
  if (process.env.NODE_ENV !== 'production') {
    return src;
  }
  
  // For production, construct CDN URL
  const cdnUrl = `https://cdn.synova.ai${src}`;
  return cdnUrl;
}
