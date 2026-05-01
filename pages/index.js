import { useState, useEffect, useCallback, useMemo } from 'react';
import Head from 'next/head';
import { AuthProvider, useAuth } from '../components/AuthContext';
import LoginForm from '../components/LoginForm';
import FileUpload from '../components/FileUpload';

function HomeContent() {
  const [status, setStatus] = useState('loading');
  const [apiStatus, setApiStatus] = useState('checking');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState('warehouse');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generationHistory, setGenerationHistory] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const { user, logout } = useAuth();

  // Use local proxy to avoid CORS issues
  const API_URL = useMemo(() => 
    '/api/proxy'
  , []);

  // Predefined prompt templates
  const promptTemplates = useMemo(() => ({
    warehouse: 'Design a modern warehouse with smart features',
    office: 'Create an innovative office space with collaborative areas',
    retail: 'Design a cutting-edge retail store with customer experience focus',
    residential: 'Plan a sustainable residential building with green features',
    industrial: 'Design an efficient industrial facility with automation',
    custom: 'custom prompt'
  }), []);

  const checkApiHealth = useCallback(async () => {
    console.log('🔍 Debug: API_URL =', API_URL);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(`${API_URL}/health`, {
        signal: controller.signal,
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setApiStatus(data.status === 'healthy' ? 'connected' : 'error');
      console.log('🧠 API Status:', data);
    } catch (error) {
      setApiStatus('error');
      const errorMessage = error.name === 'AbortError' ? 'Request timeout' : error.message;
      console.error('❌ API connection failed:', errorMessage);
    }
  }, [API_URL]);

  const testAIGeneration = useCallback(async () => {
    if (isLoading) return; // Prevent multiple simultaneous requests
    
    try {
      setIsLoading(true);
      setAiResponse('Thinking...');
      
      const response = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: selectedPrompt === 'custom' ? customPrompt : promptTemplates[selectedPrompt]
        }),
      });
      
      const data = await response.json();
      
      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }
      
      setAiResponse(data.response || 'No response received');
      
      // Add to generation history
      const newEntry = {
        id: Date.now(),
        prompt: selectedPrompt === 'custom' ? customPrompt : promptTemplates[selectedPrompt],
        response: data.response || 'No response received',
        timestamp: new Date().toLocaleString()
      };
      setGenerationHistory(prev => [newEntry, ...prev].slice(0, 5)); // Keep last 5 entries
    } catch (error) {
      const errorMessage = error.name === 'AbortError' ? 'Request timeout - please try again' : error.message;
      setAiResponse('Error: ' + errorMessage);
      console.error('AI generation failed:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL, isLoading, selectedPrompt, customPrompt, promptTemplates]);

  const handleFileUploadComplete = (uploadData) => {
    setUploadedFiles(prev => [uploadData, ...prev]);
    console.log('File uploaded:', uploadData);
  };

  const handleFileUploadError = (error) => {
    console.error('Upload error:', error);
  };

  useEffect(() => {
    setStatus('ready');
    checkApiHealth();
  }, [checkApiHealth]);

  if (!user) {
    return <LoginForm />;
  }

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
          <h1 className="title"> SYNOVA AI v4.1</h1>
          <h2 className="subtitle">AUTOPILOT MODE - ULTIMATE EDITION</h2>
          
          <div className="status">
            <p> Status: <strong>{status}</strong></p>
            <p> API: <strong>{apiStatus}</strong></p>
            <p> User: <strong>{user.email}</strong></p>
            <p> Role: <strong>{user.role}</strong></p>
            <p> All systems operational</p>
            <p> Production ready</p>
            <button onClick={logout} className="logout-button">
              Sign Out
            </button>
            {user.role === 'admin' && (
              <button 
                onClick={() => window.location.href = '/admin'} 
                className="admin-button"
              >
                Admin Dashboard
              </button>
            )}
          </div>

          <div className="ai-generator">
            <h3>AI Architecture Generator</h3>
            
            <div className="prompt-selector">
              <label htmlFor="prompt-select">Choose Template:</label>
              <select 
                id="prompt-select"
                value={selectedPrompt} 
                onChange={(e) => setSelectedPrompt(e.target.value)}
                disabled={isLoading}
                className="prompt-dropdown"
              >
                <option value="warehouse">Smart Warehouse</option>
                <option value="office">Innovative Office</option>
                <option value="retail">Modern Retail</option>
                <option value="residential">Sustainable Residential</option>
                <option value="industrial">Automated Industrial</option>
                <option value="custom">Custom Prompt</option>
              </select>
            </div>

            {selectedPrompt === 'custom' && (
              <div className="custom-prompt">
                <label htmlFor="custom-input">Custom Prompt:</label>
                <textarea
                  id="custom-input"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Enter your custom architecture prompt..."
                  disabled={isLoading}
                  className="custom-textarea"
                  rows={3}
                />
              </div>
            )}

            <div className="generation-controls">
              <button 
                onClick={testAIGeneration} 
                className="ai-button" 
                disabled={isLoading || (selectedPrompt === 'custom' && !customPrompt.trim())}
              >
                {isLoading ? 'Generating...' : 'Generate Architecture'}
              </button>
            </div>

            {aiResponse && (
              <div className="ai-response">
                <h4>AI Response:</h4>
                <p>{aiResponse}</p>
              </div>
            )}

            {generationHistory.length > 0 && (
              <div className="generation-history">
                <h4>Recent Generations:</h4>
                <div className="history-list">
                  {generationHistory.map((entry) => (
                    <div key={entry.id} className="history-item">
                      <div className="history-prompt">{entry.prompt}</div>
                      <div className="history-response">{entry.response}</div>
                      <div className="history-timestamp">{entry.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="blueprint-upload">
            <h3>Blueprint Upload</h3>
            <FileUpload 
              onUploadComplete={handleFileUploadComplete}
              onUploadError={handleFileUploadError}
            />
            
            {uploadedFiles.length > 0 && (
              <div className="uploaded-files">
                <h4>Uploaded Files:</h4>
                <div className="files-list">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="file-item">
                      <div className="file-info">
                        <div className="file-name">{file.filename}</div>
                        <div className="file-details">
                          {file.type} - {(file.size / 1024).toFixed(1)}KB
                        </div>
                      </div>
                      <div className="file-actions">
                        <a href={file.url} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
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

export default function Home() {
  return (
    <AuthProvider>
      <HomeContent />
    </AuthProvider>
  );
}
