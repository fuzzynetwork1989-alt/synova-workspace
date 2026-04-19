import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [status, setStatus] = useState('loading');
  const [apiStatus, setApiStatus] = useState('checking');
  const [aiResponse, setAiResponse] = useState('');

  // Production API URL
  const API_URL = 'https://synova-core-api-production-65d1.up.railway.app';

  useEffect(() => {
    setStatus('ready');
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      const data = await response.json();
      setApiStatus(data.status === 'healthy' ? 'connected' : 'error');
      console.log('🧠 API Status:', data);
    } catch (error) {
      setApiStatus('error');
      console.error('❌ API connection failed:', error);
    }
  };

  const testAIGeneration = async () => {
    try {
      setAiResponse('Thinking...');
      const response = await fetch(`${API_URL}/ai/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: 'Design a modern warehouse with smart features'
        }),
      });
      const data = await response.json();
      setAiResponse(data.response || 'No response received');
    } catch (error) {
      setAiResponse('Error: ' + error.message);
      console.error('❌ AI generation failed:', error);
    }
  };

  return (
    <>
      <Head>
        <title>Synova AI v4.1 - Autopilot Mode</title>
        <meta name="description" content="Synova AI Autopilot Mode v4.1 - Complete AI-powered XR architecture factory" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="main">
        <div className="container">
          <h1 className="title">🚀 SYNOVA AI v4.1</h1>
          <h2 className="subtitle">AUTOPILOT MODE - ULTIMATE EDITION</h2>
          
          <div className="status">
            <p>📊 Status: <strong>{status}</strong></p>
            <p>� API: <strong>{apiStatus}</strong></p>
            <p>�🎯 All systems operational</p>
            <p>⚡ Production ready</p>
          </div>

          <div className="api-test">
            <h3>🧠 Test AI Brain</h3>
            <button onClick={testAIGeneration} className="ai-button">
              Generate Architecture Design
            </button>
            {aiResponse && (
              <div className="ai-response">
                <h4>AI Response:</h4>
                <p>{aiResponse}</p>
              </div>
            )}
          </div>

          <div className="grid">
            <div className="card">
              <h3>🧠 Synova Brain v3.2</h3>
              <p>AI-powered architecture generation</p>
            </div>
            
            <div className="card">
              <h3>🏗️ Holo-Renderer</h3>
              <p>Real-time 3D blueprint creation</p>
            </div>
            
            <div className="card">
              <h3>🎮 XR Workspace</h3>
              <p>Meta Quest 3 ready apps</p>
            </div>
            
            <div className="card">
              <h3>💰 Revenue Systems</h3>
              <p>Stripe + Fiverr integration</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
