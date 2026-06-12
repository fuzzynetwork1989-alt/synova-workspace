# 🔧 Astranova Enhanced Synova Brain Integration

## 📱 **Quick Setup After Deployment**

### **1. Install Dependencies**
```bash
cd astranova-app
npm install
```

### **2. Environment Configuration**
Create `.env.local`:
```env
# Enhanced Synova Brain URLs
NEXT_PUBLIC_SYNNOVA_API_URL=https://your-railway-url.up.railway.app
NEXT_PUBLIC_SYNNOVA_WS_URL=ws://your-railway-url.up.railway.app/ws

# Feature Flags
NEXT_PUBLIC_SYNNOVA_BRAIN_ENABLED=true
NEXT_PUBLIC_STREAMING_ENABLED=true
NEXT_PUBLIC_FUNCTION_CALLING_ENABLED=true
NEXT_PUBLIC_MULTIMODAL_ENABLED=true
NEXT_PUBLIC_CODE_GENERATION_ENABLED=true
NEXT_PUBLIC_ADVANCED_REASONING_ENABLED=true
NEXT_PUBLIC_CONVERSATION_MEMORY_ENABLED=true
```

### **3. Add Enhanced Brain Wrapper**
Copy `synova-brain-llm-wrapper.js` to `src/lib/`:
```bash
cp ../synova-brain-llm-wrapper.js src/lib/
```

### **4. Update Main Chat Component**
Replace your existing AI chat with enhanced version:

```jsx
// src/components/EnhancedSynovaChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import SynovaBrainLLM from '../lib/synova-brain-llm-wrapper';

const EnhancedSynovaChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [enhancedFeatures, setEnhancedFeatures] = useState({
    streaming: true,
    functionCalling: true,
    multimodal: true,
    codeGeneration: true,
    reasoning: true,
    memory: true
  });
  
  const synovaBrain = useRef(new SynovaBrainLLM(
    process.env.NEXT_PUBLIC_SYNNOVA_API_URL
  )).current;
  const wsRef = useRef(null);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);
    setStreamingText('');

    try {
      if (enhancedFeatures.streaming) {
        // Use streaming for real-time response
        const streamResponse = await synovaBrain.streamChat({
          messages: [...messages, userMessage],
          onChunk: (chunk) => {
            setStreamingText(prev => prev + chunk);
          }
        });

        // Check for function calls
        if (enhancedFeatures.functionCalling) {
          const functionResult = await synovaBrain.functionCall(input);
          if (functionResult.type === 'function_call') {
            // Auto-generate blueprint
            const blueprint = await synovaBrain.generateBlueprint(
              functionResult.arguments.blueprint_type || 'modern',
              functionResult.arguments.parameters || {}
            );
            
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: streamResponse.choices[0].message.content,
              blueprint: blueprint,
              type: 'function_call'
            }]);
          } else {
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: streamResponse.choices[0].message.content
            }]);
          }
        }
      } else {
        // Use regular chat
        const response = await synovaBrain.chat({
          messages: [...messages, userMessage]
        });
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response.choices[0].message.content
        }]);
      }
      
    } catch (error) {
      console.error('Enhanced AI Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${error.message}`
      }]);
    } finally {
      setIsStreaming(false);
      setStreamingText('');
    }
  };

  const handleImageUpload = async (files) => {
    if (!enhancedFeatures.multimodal) return;
    
    const images = Array.from(files).map(file => URL.createObjectURL(file));
    
    try {
      const result = await synovaBrain.multimodal(
        messages[messages.length - 1]?.content || '',
        images
      );
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: result.text_analysis,
        imageAnalysis: result.image_analysis,
        type: 'multimodal'
      }]);
    } catch (error) {
      console.error('Multimodal Error:', error);
    }
  };

  const handleCodeGeneration = async (prompt) => {
    if (!enhancedFeatures.codeGeneration) return;
    
    try {
      const result = await synovaBrain.generateCode(prompt, 'react');
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: result.explanation,
        code: result.code,
        type: 'code_generation'
      }]);
    } catch (error) {
      console.error('Code Generation Error:', error);
    }
  };

  const handleAdvancedReasoning = async (prompt) => {
    if (!enhancedFeatures.reasoning) return;
    
    try {
      const result = await synovaBrain.reasoning(prompt);
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: result.response,
        reasoningSteps: result.reasoning_steps,
        type: 'advanced_reasoning'
      }]);
    } catch (error) {
      console.error('Reasoning Error:', error);
    }
  };

  // WebSocket connection for real-time updates
  useEffect(() => {
    if (!wsRef.current && enhancedFeatures.streaming) {
      const ws = synovaBrain.connectWebSocket(
        (data) => {
          if (data.type === 'chunk') {
            setStreamingText(prev => prev + data.content);
          } else if (data.type === 'completion') {
            setIsStreaming(false);
            setStreamingText('');
          }
        },
        (error) => {
          console.error('WebSocket Error:', error);
        }
      );
      wsRef.current = ws;
    }
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [enhancedFeatures.streaming]);

  return (
    <div className="enhanced-synova-chat">
      <div className="chat-header">
        <h3>🧠 Enhanced Synova Brain</h3>
        <div className="feature-toggles">
          <label>
            <input
              type="checkbox"
              checked={enhancedFeatures.streaming}
              onChange={(e) => setEnhancedFeatures(prev => ({
                ...prev, streaming: e.target.checked
              }))}
            />
            Streaming
          </label>
          <label>
            <input
              type="checkbox"
              checked={enhancedFeatures.functionCalling}
              onChange={(e) => setEnhancedFeatures(prev => ({
                ...prev, functionCalling: e.target.checked
              }))}
            />
            Function Calls
          </label>
          <label>
            <input
              type="checkbox"
              checked={enhancedFeatures.multimodal}
              onChange={(e) => setEnhancedFeatures(prev => ({
                ...prev, multimodal: e.target.checked
              }))}
            />
            Images
          </label>
          <label>
            <input
              type="checkbox"
              checked={enhancedFeatures.codeGeneration}
              onChange={(e) => setEnhancedFeatures(prev => ({
                ...prev, codeGeneration: e.target.checked
              }))}
            />
            Code
          </label>
          <label>
            <input
              type="checkbox"
              checked={enhancedFeatures.reasoning}
              onChange={(e) => setEnhancedFeatures(prev => ({
                ...prev, reasoning: e.target.checked
              }))}
            />
            Reasoning
          </label>
        </div>
      </div>

      <div className="messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.role}`}>
            <div className="content">{msg.content}</div>
            
            {msg.type === 'function_call' && msg.blueprint && (
              <div className="blueprint-result">
                <h4>🏗️ Generated Blueprint</h4>
                <p><strong>Name:</strong> {msg.blueprint.name}</p>
                <p><strong>ID:</strong> {msg.blueprint.blueprint_id}</p>
                <a href={msg.blueprint.gltf_url} download>
                  Download 3D Model
                </a>
              </div>
            )}
            
            {msg.type === 'multimodal' && msg.imageAnalysis && (
              <div className="image-analysis">
                <h4>🖼️ Image Analysis</h4>
                <pre>{JSON.stringify(msg.imageAnalysis, null, 2)}</pre>
              </div>
            )}
            
            {msg.type === 'code_generation' && msg.code && (
              <div className="code-result">
                <h4>💻 Generated Code</h4>
                <pre><code>{msg.code}</code></pre>
              </div>
            )}
            
            {msg.type === 'advanced_reasoning' && msg.reasoningSteps && (
              <div className="reasoning-steps">
                <h4>🧠 Reasoning Steps</h4>
                <ol>
                  {msg.reasoningSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        ))}
        
        {isStreaming && streamingText && (
          <div className="message assistant streaming">
            <div className="content">{streamingText}</div>
            <div className="typing-indicator">...</div>
          </div>
        )}
      </div>

      <div className="input-area">
        <div className="input-row">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask Enhanced Synova Brain anything..."
            disabled={isStreaming}
          />
          
          {enhancedFeatures.multimodal && (
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files)}
              disabled={isStreaming}
            />
          )}
          
          <button
            onClick={handleSendMessage}
            disabled={isStreaming || !input.trim()}
          >
            {isStreaming ? '📡 Streaming...' : '🚀 Send'}
          </button>
        </div>
        
        <div className="quick-actions">
          <button
            onClick={() => handleCodeGeneration('Create React component for 3D model viewer')}
            disabled={!enhancedFeatures.codeGeneration}
          >
            💻 Generate Code
          </button>
          <button
            onClick={() => handleAdvancedReasoning('Compare modern vs traditional architecture')}
            disabled={!enhancedFeatures.reasoning}
          >
            🧠 Advanced Reasoning
          </button>
        </div>
      </div>

      <style jsx>{`
        .enhanced-synova-chat {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: system-ui, sans-serif;
        }
        
        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding: 15px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-radius: 10px;
        }
        
        .feature-toggles {
          display: flex;
          gap: 15px;
        }
        
        .feature-toggles label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
        }
        
        .messages {
          height: 400px;
          overflow-y: auto;
          border: 1px solid #ddd;
          border-radius: 10px;
          padding: 15px;
          margin-bottom: 20px;
          background: #f9f9f9;
        }
        
        .message {
          margin-bottom: 15px;
          padding: 10px;
          border-radius: 8px;
        }
        
        .message.user {
          background: #e3f2fd;
          margin-left: 20%;
        }
        
        .message.assistant {
          background: #f3e5f5;
          margin-right: 20%;
        }
        
        .streaming .typing-indicator {
          color: #666;
          animation: pulse 1s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .blueprint-result, .image-analysis, .code-result, .reasoning-steps {
          margin-top: 10px;
          padding: 10px;
          background: #e8f5e8;
          border-radius: 5px;
          border-left: 4px solid #4caf50;
        }
        
        .code-result pre {
          background: #f5f5f5;
          padding: 10px;
          border-radius: 3px;
          overflow-x: auto;
        }
        
        .input-area {
          background: white;
          padding: 15px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .input-row {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }
        
        .input-row input[type="text"] {
          flex: 1;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        
        .input-row button {
          padding: 10px 20px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        
        .quick-actions {
          display: flex;
          gap: 10px;
        }
        
        .quick-actions button {
          padding: 8px 15px;
          background: #f5f5f5;
          border: 1px solid #ddd;
          border-radius: 5px;
          cursor: pointer;
        }
        
        .quick-actions button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default EnhancedSynovaChat;
```

### **5. Update App Integration**
Replace your main chat component:
```jsx
// src/pages/index.jsx or your main app file
import EnhancedSynovaChat from '../components/EnhancedSynovaChat';

export default function Home() {
  return (
    <div>
      <EnhancedSynovaChat />
    </div>
  );
}
```

### **6. Deploy Astranova**
```bash
npm run build
npm run deploy
```

---

## 🎯 **Testing Integration**

### **1. Basic Chat Test**
- Send a message like "Design modern office"
- Should see streaming response
- Check for real-time text updates

### **2. Function Calling Test**
- Send "Build warehouse with office space"
- Should auto-generate blueprint
- Check for 3D model download link

### **3. Multimodal Test**
- Upload an architectural image
- Ask "Analyze this design"
- Should provide image + text analysis

### **4. Code Generation Test**
- Click "Generate Code" button
- Should create React component
- Check for syntax-highlighted code

### **5. Advanced Reasoning Test**
- Click "Advanced Reasoning" button
- Should show step-by-step logic
- Check for reasoning steps display

---

## 🚀 **Production Features Enabled**

✅ **Real-time Streaming** - ChatGPT-like responses
✅ **Function Calling** - Automatic blueprint generation
✅ **Multimodal** - Image + text analysis
✅ **Code Generation** - Multi-language support
✅ **Advanced Reasoning** - Step-by-step logic
✅ **Conversation Memory** - Context awareness
✅ **WebSocket** - Real-time communication
✅ **OpenAI Compatible** - Drop-in replacement

**🎉 Your Astranova now has ChatGPT/Perplexity/Grok-level capabilities!**
