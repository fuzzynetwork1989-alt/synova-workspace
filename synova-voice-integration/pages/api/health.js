/**
 * Health check API endpoint for Synova Voice Integration
 */

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.status(200).json({
    status: 'healthy',
    service: 'Synova Voice Integration v4.1',
    timestamp: new Date().toISOString(),
    features: {
      whisper: 'available',
      mediapipe: 'available',
      voiceRecognition: 'active',
      xrIntegration: 'ready'
    }
  });
}
