# Synova Brain Integration for Astranova
# Configuration and integration steps

## 🧠 **Synova Brain Setup**

### **Production URLs (After Railway Deployment):**
- **Core API**: `https://synova-core-api-production.up.railway.app`
- **AI Endpoint**: `https://synova-core-api-production.up.railway.app/ai/generate`
- **Blueprint Endpoint**: `https://synova-core-api-production.up.railway.app/ai/blueprint`
- **WebSocket**: `wss://synova-core-api-production.up.railway.app/ws`

## 🔗 **Astranova Integration**

### **1. Frontend Integration**
```javascript
// components/SynovaAIAssistant.jsx
import React, { useState } from 'react';

const SynovaAIAssistant = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const generateDesign = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://synova-core-api-production.up.railway.app/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt,
          tier: 'synova-brain-v3.2',
          session_id: `astranova_${Date.now()}`
        })
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error('AI Error:', error);
      setResponse('Sorry, I encountered an error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="ai-assistant">
      <h3>🧠 Synova Brain Assistant</h3>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your XR architecture design..."
      />
      <button onClick={generateDesign} disabled={loading}>
        {loading ? '🤖 Thinking...' : '🚀 Generate Design'}
      </button>
      {response && (
        <div className="ai-response">
          <h4>🏗️ AI Design Response:</h4>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};
```

### **2. WebSocket Integration for Real-time Chat**
```javascript
// hooks/useSynovaWebSocket.js
import { useEffect, useRef } from 'react';

export const useSynovaWebSocket = () => {
  const ws = useRef(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    ws.current = new WebSocket('wss://synova-core-api-production.up.railway.app/ws');
    
    ws.current.onopen = () => {
      console.log('🔗 Connected to Synova Brain WebSocket');
    };
    
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: data.content,
        timestamp: new Date()
      }]);
    };
    
    ws.current.onerror = (error) => {
      console.error('❌ WebSocket Error:', error);
    };
    
    return () => {
      ws.current?.close();
    };
  }, []);

  const sendMessage = (prompt, tier = 'synova-brain-v3.2') => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ prompt, tier }));
    }
  };

  return { messages, sendMessage };
};
```

### **3. Blueprint Generation Integration**
```javascript
// services/SynovaBlueprintService.js
export class SynovaBlueprintService {
  static async generateBlueprint(type, parameters = {}, voiceCommand = null) {
    try {
      const response = await fetch('https://synova-core-api-production.up.railway.app/ai/blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blueprint_type: type,
          parameters,
          voice_command: voiceCommand
        })
      });
      
      const blueprint = await response.json();
      
      // Generate 3D model using blueprint data
      return {
        id: blueprint.blueprint_id,
        name: blueprint.name,
        gltfUrl: `https://synova-core-api-production.up.railway.app${blueprint.gltf_url}`,
        babylonScene: blueprint.babylon_scene,
        createdAt: blueprint.created_at
      };
    } catch (error) {
      console.error('Blueprint generation failed:', error);
      throw error;
    }
  }

  static async downloadGLTF(blueprintId) {
    const response = await fetch(
      `https://synova-core-api-production.up.railway.app/api/models/${blueprintId}.glb`
    );
    return response.blob();
  }
}
```

## 🎯 **Astranova Implementation Steps**

### **Phase 1: Core Integration**
1. **Add AI Assistant Component** - Include in main dashboard
2. **Connect WebSocket** - Enable real-time chat functionality  
3. **Implement Blueprint Service** - Handle 3D model generation
4. **Update Environment Variables** - Point to production URLs

### **Phase 2: Voice Commands**
1. **Voice Recognition Setup** - Integrate with browser Web Speech API
2. **Command Processing** - Send voice commands to Synova Brain
3. **Real-time Feedback** - Display AI responses instantly

### **Phase 3: 3D Visualization**
1. **GLTF Model Loading** - Display AI-generated blueprints
2. **Babylon.js Integration** - Render 3D models in browser
3. **AR/VR Support** - Enable immersive viewing

## 🔧 **Environment Configuration**

### **Astranova .env.local**
```env
# Synova Brain Production URLs
NEXT_PUBLIC_SYNNOVA_API_URL=https://synova-core-api-production.up.railway.app
NEXT_PUBLIC_SYNNOVA_WS_URL=wss://synova-core-api-production.up.railway.app/ws
NEXT_PUBLIC_SYNNOVA_AI_ENDPOINT=/ai/generate
NEXT_PUBLIC_SYNNOVA_BLUEPRINT_ENDPOINT=/ai/blueprint

# Feature Flags
NEXT_PUBLIC_SYNNOVA_BRAIN_ENABLED=true
NEXT_PUBLIC_VOICE_COMMANDS_ENABLED=true
NEXT_PUBLIC_3D_BLUEPRINTS_ENABLED=true
```

## 📱 **Mobile Integration**

### **React Native Bridge**
```javascript
// services/SynovaMobileBridge.js
export const SynovaMobileBridge = {
  async generateDesign(prompt) {
    const response = await fetch('https://synova-core-api-production.up.railway.app/ai/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, tier: 'synova-brain-v3.2' })
    });
    return response.json();
  },

  async processVoiceCommand(command) {
    return this.generateDesign(`Voice command: ${command}`);
  },

  async generate3DBlueprint(type, params) {
    const response = await fetch('https://synova-core-api-production.up.railway.app/ai/blueprint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        blueprint_type: type,
        parameters: params,
        voice_command: null
      })
    });
    return response.json();
  }
};
```

## 🚀 **Deployment Steps**

### **1. Deploy Core API**
```bash
railway login
cd synova-core-api
railway up --service synova-core-api
```

### **2. Update Astranova**
```bash
cd astranova
npm install
# Update .env.local with production URLs
npm run build
```

### **3. Deploy Astranova**
```bash
# Deploy to Vercel
vercel --prod

# Or deploy to your preferred platform
```

### **4. Test Integration**
```bash
# Test AI endpoints
curl https://synova-core-api-production.up.railway.app/health

# Test Astranova frontend
# Visit your deployed Astranova app and test AI features
```

## 📊 **Success Metrics**

### **Expected Performance:**
- **AI Response Time**: 2-3 seconds
- **Blueprint Generation**: 5-10 seconds  
- **WebSocket Latency**: <100ms
- **3D Model Loading**: 1-2 seconds

### **Monitoring:**
- **Health Checks**: `/health` endpoint
- **AI Metrics**: Response time, success rate
- **Usage Analytics**: Prompt frequency, popular features

---

**🎉 Your Synova Brain is now ready to power Astranova with AI-driven XR architecture!**
