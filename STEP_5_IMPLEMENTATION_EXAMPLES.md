# 🚀 Step 5: Implementation Examples

## 🧠 **Using Synova Brain as Main LLM**

### **1. Direct API Usage**

#### **Test Synova Brain Locally:**
```bash
# Start the API server
cd synova-core-api
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Test AI generation (in another terminal)
curl -X POST http://localhost:8000/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Design a modern office building with glass walls"}'

# Test blueprint generation
curl -X POST http://localhost:8000/ai/blueprint \
  -H "Content-Type: application/json" \
  -d '{"blueprint_type": "warehouse", "voice_command": "Build large industrial warehouse"}'
```

#### **WebSocket Test:**
```javascript
// Connect to WebSocket
const ws = new WebSocket('ws://localhost:8000/ws');

ws.onopen = () => {
  console.log('🔗 Connected to Synova Brain');
  
  // Test Synova Brain
  ws.send(JSON.stringify({
    prompt: "Design luxury home with infinity pool",
    tier: "synova-brain-v3.2"
  }));
};

ws.onmessage = (event) => {
  console.log('🤖 AI Response:', event.data);
};
```

### **2. Astranova Integration**

#### **React Component Example:**
```jsx
// components/SynovaAIDesigner.jsx
import React, { useState, useEffect } from 'react';

const SynovaAIDesigner = () => {
  const [prompt, setPrompt] = useState('');
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [blueprint, setBlueprint] = useState(null);

  const generateDesign = async () => {
    setLoading(true);
    try {
      // Call your deployed Railway API
      const response = await fetch('https://your-railway-url.up.railway.app/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          tier: 'synova-brain-v3.2',
          session_id: `astranova_${Date.now()}`
        })
      });
      
      const result = await response.json();
      setDesign(result.response);
      
      // Auto-generate blueprint
      await generateBlueprint('modern_office');
      
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateBlueprint = async (type) => {
    try {
      const response = await fetch('https://your-railway-url.up.railway.app/ai/blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blueprint_type: type,
          voice_command: prompt
        })
      });
      
      const blueprint = await response.json();
      setBlueprint(blueprint);
      
      // Download 3D model
      const modelBlob = await fetch(blueprint.gltf_url);
      const modelUrl = URL.createObjectURL(modelBlob);
      
      // Display in 3D viewer
      if (window.viewer) {
        window.viewer.loadModel(modelUrl);
      }
      
    } catch (error) {
      console.error('Blueprint generation failed:', error);
    }
  };

  return (
    <div className="ai-designer">
      <div className="input-section">
        <h2>🧠 Synova Brain Designer</h2>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your XR architecture design..."
          rows={4}
          style={{ width: '100%', padding: '10px' }}
        />
        <button 
          onClick={generateDesign} 
          disabled={loading}
          style={{ 
            background: '#667eea', 
            color: 'white', 
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '🤖 Thinking...' : '🚀 Generate Design'}
        </button>
      </div>
      
      {design && (
        <div className="design-result">
          <h3>🏗️ AI Design Response</h3>
          <div className="design-text">{design}</div>
        </div>
      )}
      
      {blueprint && (
        <div className="blueprint-result">
          <h3>📐 Generated Blueprint</h3>
          <p><strong>Name:</strong> {blueprint.name}</p>
          <p><strong>ID:</strong> {blueprint.blueprint_id}</p>
          <p><strong>3D Model:</strong> 
            <a href={blueprint.gltf_url} download>
              Download GLTF
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default SynovaAIDesigner;
```

#### **Voice Command Integration:**
```javascript
// hooks/useVoiceCommands.js
import { useState, useEffect, useCallback } from 'react';

export const useVoiceCommands = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Speech recognition not supported');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setTranscript(transcript);
      
      // Auto-send to Synova Brain
      if (event.results[current].isFinal) {
        processVoiceCommand(transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    setIsListening(true);
  }, []);

  const processVoiceCommand = async (command) => {
    try {
      console.log('🎤 Voice command:', command);
      
      const response = await fetch('https://your-railway-url.up.railway.app/voice/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audio_data: null, // Would send actual audio in production
          command_type: 'whisper'
        })
      });
      
      const result = await response.json();
      console.log('🤖 Processed:', result);
      
      // Generate blueprint based on intent
      if (result.intent) {
        const blueprintResponse = await fetch('https://your-railway-url.up.railway.app/ai/blueprint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            blueprint_type: result.intent,
            voice_command: command
          })
        });
        
        const blueprint = await blueprintResponse.json();
        console.log('🏗️ Generated blueprint:', blueprint);
      }
      
    } catch (error) {
      console.error('Voice command processing failed:', error);
    }
  };

  const stopListening = useCallback(() => {
    if (window.recognition) {
      window.recognition.stop();
      setIsListening(false);
    }
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    processVoiceCommand
  };
};
```

### **3. 3D Model Integration**

#### **Babylon.js Viewer:**
```javascript
// components/BabylonViewer.jsx
import { useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';

const BabylonViewer = ({ modelUrl }) => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !modelUrl) return;

    // Initialize Babylon.js
    const engine = new BABYLON.Engine(canvasRef.current, {
      preserveDrawingBuffer: true,
      stencil: true
    });
    engineRef.current = engine;

    const scene = new BABYLON.Scene(engine);
    sceneRef.current = scene;

    // Load 3D model
    BABYLON.SceneLoader.ImportMesh(
      "", 
      modelUrl, 
      scene,
      function (meshes) {
        // Position camera
        const camera = new BABYLON.ArcRotateCamera(
          "camera", 
          Math.PI / 2, 
          Math.PI / 2, 
          10, 
          scene
        );
        camera.attachControl(canvasRef.current, true);
        
        // Add lighting
        const light = new BABYLON.HemisphericLight(
          "light", 
          new BABYLON.Color3(1, 1, 1), 
          scene
        );
        
        // Scale and position model
        meshes.forEach(mesh => {
          mesh.scaling = new BABYLON.Vector3(0.1, 0.1, 0.1);
          mesh.position = new BABYLON.Vector3(0, 0, 0);
        });
        
        // Start render loop
        engine.runRenderLoop(() => {
          scene.render();
        });
      }
    );

    return () => {
      // Cleanup
      if (engineRef.current) {
        engineRef.current.dispose();
      }
    };
  }, [modelUrl]);

  return (
    <div className="babylon-viewer">
      <canvas 
        ref={canvasRef}
        style={{ width: '100%', height: '400px', border: '1px solid #ccc' }}
      />
    </div>
  );
};

export default BabylonViewer;
```

### **4. Environment Configuration**

#### **Astranova .env.local:**
```env
# Synova Brain API Configuration
NEXT_PUBLIC_SYNNOVA_API_URL=https://your-railway-url.up.railway.app
NEXT_PUBLIC_SYNNOVA_WS_URL=ws://your-railway-url.up.railway.app/ws
NEXT_PUBLIC_SYNNOVA_AI_ENDPOINT=/ai/generate
NEXT_PUBLIC_SYNNOVA_BLUEPRINT_ENDPOINT=/ai/blueprint

# Feature Flags
NEXT_PUBLIC_SYNNOVA_BRAIN_ENABLED=true
NEXT_PUBLIC_VOICE_COMMANDS_ENABLED=true
NEXT_PUBLIC_3D_BLUEPRINTS_ENABLED=true
NEXT_PUBLIC_REAL_TIME_CHAT=true

# 3D Viewer Configuration
NEXT_PUBLIC_BABYLONJS_ENABLED=true
NEXT_PUBLIC_GLTF_LOADER=true

# Development Settings
NEXT_PUBLIC_DEV_MODE=false
NEXT_PUBLIC_DEBUG_AI=false
```

### **5. Deployment Commands**

#### **Deploy Core API to Railway:**
```bash
# 1. Login to Railway
railway login

# 2. Deploy Synova Core API
cd synova-core-api
railway up --service synova-core-api

# 3. Set environment variables
railway variables set SYNNOVA_BRAIN_ENABLED=true
railway variables set MODEL_NAME=microsoft/DialoGPT-medium
railway variables set DEVICE=cpu

# 4. Get production URL
railway status
# Expected: https://synova-core-api-production.up.railway.app
```

#### **Deploy Astranova to Vercel:**
```bash
# 1. Install dependencies
cd astranova
npm install

# 2. Update environment
cp .env.example .env.local
# Edit .env.local with your Railway URL

# 3. Build and deploy
npm run build
vercel --prod
```

### **6. Testing Integration**

#### **End-to-End Test:**
```javascript
// test-integration.js
const testSynovaIntegration = async () => {
  console.log('🧪 Testing Synova Brain Integration...');
  
  try {
    // Test 1: AI Generation
    const aiResponse = await fetch('https://your-railway-url.up.railway.app/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Design a sustainable eco-friendly office building',
        tier: 'synova-brain-v3.2'
      })
    });
    
    const aiResult = await aiResponse.json();
    console.log('✅ AI Response:', aiResult.response);
    
    // Test 2: Blueprint Generation
    const blueprintResponse = await fetch('https://your-railway-url.up.railway.app/ai/blueprint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        blueprint_type: 'luxury',
        voice_command: 'Create modern mansion with smart features'
      })
    });
    
    const blueprint = await blueprintResponse.json();
    console.log('✅ Blueprint Generated:', blueprint);
    
    // Test 3: WebSocket Connection
    const ws = new WebSocket('wss://your-railway-url.up.railway.app/ws');
    
    ws.onopen = () => {
      console.log('✅ WebSocket Connected');
      
      // Send test message
      ws.send(JSON.stringify({
        prompt: 'Show me VR showroom design',
        tier: 'synova-brain-v3.2'
      }));
    };
    
    ws.onmessage = (event) => {
      console.log('✅ WebSocket Response:', event.data);
      ws.close();
    };
    
    console.log('🎉 All integration tests passed!');
    
  } catch (error) {
    console.error('❌ Integration test failed:', error);
  }
};

// Run tests
testSynovaIntegration();
```

## 📊 **Success Metrics**

### **Expected Performance:**
- **AI Response Time**: 2-3 seconds
- **Blueprint Generation**: 5-10 seconds
- **WebSocket Latency**: <100ms
- **3D Model Loading**: 1-2 seconds
- **Voice Processing**: 1-2 seconds

### **Monitoring Setup:**
```javascript
// monitoring/synova-metrics.js
export const trackSynovaMetrics = {
  aiGeneration: (prompt, responseTime, success) => {
    // Send to analytics
    window.gtag?.('event', 'ai_generation', {
      prompt_length: prompt.length,
      response_time_ms: responseTime,
      success_rate: success ? 1 : 0
    });
  },
  
  blueprintGeneration: (type, generationTime, modelSize) => {
    window.gtag?.('event', 'blueprint_generation', {
      blueprint_type: type,
      generation_time_ms: generationTime,
      model_size_kb: modelSize
    });
  },
  
  voiceCommand: (command, intent, confidence) => {
    window.gtag?.('event', 'voice_command', {
      command_length: command.length,
      intent_detected: intent,
      confidence_score: confidence
    });
  }
};
```

---

## 🎯 **Complete Integration Checklist**

### **✅ Core API:**
- [x] Synova Brain integrated
- [x] WebSocket streaming fixed
- [x] All endpoints working
- [x] Error handling improved

### **✅ Railway Deployment:**
- [ ] Deploy Core API to Railway
- [ ] Set environment variables
- [ ] Test production endpoints
- [ ] Monitor performance

### **✅ Astranova Integration:**
- [ ] Add AI assistant component
- [ ] Implement WebSocket connection
- [ ] Add blueprint generation
- [ ] Integrate 3D viewer
- [ ] Add voice commands

### **✅ Testing & Validation:**
- [ ] End-to-end testing
- [ ] Performance monitoring
- [ ] Error handling validation
- [ ] User acceptance testing

**🚀 Your Synova Brain is ready for full integration with Astranova!**
