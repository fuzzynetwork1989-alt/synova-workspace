// Synova Mobile App - Model Configuration
// All Synova AI models integrated for mobile

export interface ModelConfig {
  id: string;
  name: string;
  version: string;
  baseModel: string;
  contextWindow: number;
  maxTokens: number;
  temperature: number;
  topP: number;
  topK: number;
  repeatPenalty: number;
  capabilities: string[];
  specialization: string;
  description: string;
  tier: 'standard' | 'pro' | 'ultra';
  requiresInternet: boolean;
  mobileOptimized: boolean;
}

export const MODEL_REGISTRY: Record<string, ModelConfig> = {
  // Core Models
  'synova-nexus': {
    id: 'synova-nexus',
    name: 'Synova Nexus',
    version: '1.0.0',
    baseModel: 'llama3:8b-instruct',
    contextWindow: 8192,
    maxTokens: 4096,
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    capabilities: ['text', 'reasoning', 'code', 'creative', 'analysis'],
    specialization: 'general-purpose',
    description: 'Advanced AI assistant with integrated Supanova, Astranova, Voice, and XR capabilities',
    tier: 'standard',
    requiresInternet: false,
    mobileOptimized: true
  },
  
  'synova-nexus-enhanced': {
    id: 'synova-nexus-enhanced',
    name: 'Synova Nexus Enhanced',
    version: '1.0.0',
    baseModel: 'llama2:13b',
    contextWindow: 8192,
    maxTokens: 4096,
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    capabilities: ['text', 'advanced-reasoning', 'pattern-recognition', 'synthesis', 'metacognition'],
    specialization: 'enhanced-cognitive',
    description: 'Advanced cognitive model with superior reasoning, creativity, and analytical capabilities',
    tier: 'standard',
    requiresInternet: false,
    mobileOptimized: true
  },

  // Revolutionary Models
  'synova-deepseek-quantum': {
    id: 'synova-deepseek-quantum',
    name: 'Synova DeepSeek Quantum',
    version: '1.0.0',
    baseModel: 'deepseek-coder:33b',
    contextWindow: 16384,
    maxTokens: 8192,
    temperature: 0.6,
    topP: 0.85,
    topK: 35,
    repeatPenalty: 1.15,
    capabilities: ['code', 'quantum-reasoning', 'debugging', 'optimization', 'architecture'],
    specialization: 'quantum-coding',
    description: 'Quantum-enhanced coding model with advanced reasoning and optimization',
    tier: 'pro',
    requiresInternet: true,
    mobileOptimized: false
  },

  'synova-gemma4-quantum': {
    id: 'synova-gemma4-quantum',
    name: 'Synova Gemma4 Quantum',
    version: '1.0.0',
    baseModel: 'gemma2:27b',
    contextWindow: 8192,
    maxTokens: 4096,
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    capabilities: ['text', 'reasoning', 'multilingual', 'creative', 'analysis'],
    specialization: 'quantum-multimodal',
    description: 'Quantum-enhanced multimodal model with advanced reasoning capabilities',
    tier: 'pro',
    requiresInternet: true,
    mobileOptimized: false
  },

  'synova-gemma4-quantum-elite': {
    id: 'synova-gemma4-quantum-elite',
    name: 'Synova Gemma4 Quantum Elite',
    version: '1.0.0',
    baseModel: 'gemma2:27b',
    contextWindow: 16384,
    maxTokens: 6144,
    temperature: 0.6,
    topP: 0.85,
    topK: 35,
    repeatPenalty: 1.15,
    capabilities: ['text', 'advanced-reasoning', 'multilingual', 'elite-creative', 'deep-analysis'],
    specialization: 'elite-quantum',
    description: 'Elite quantum-enhanced model with maximum reasoning and creative capabilities',
    tier: 'ultra',
    requiresInternet: true,
    mobileOptimized: false
  },

  'synova-neural-quantum': {
    id: 'synova-neural-quantum',
    name: 'Synova Neural Quantum',
    version: '1.0.0',
    baseModel: 'neural-chat:7b',
    contextWindow: 8192,
    maxTokens: 4096,
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    capabilities: ['text', 'neural-reasoning', 'pattern-recognition', 'learning', 'adaptation'],
    specialization: 'neural-quantum',
    description: 'Neural network enhanced quantum model with adaptive learning capabilities',
    tier: 'pro',
    requiresInternet: true,
    mobileOptimized: false
  },

  'synova-omni-nexus': {
    id: 'synova-omni-nexus',
    name: 'Synova Omni Nexus',
    version: '1.0.0',
    baseModel: 'llama3:70b-instruct',
    contextWindow: 16384,
    maxTokens: 8192,
    temperature: 0.6,
    topP: 0.85,
    topK: 35,
    repeatPenalty: 1.15,
    capabilities: ['text', 'multimodal', 'reasoning', 'creative', 'analysis', 'code'],
    specialization: 'omni-multimodal',
    description: 'Omni-capable model with comprehensive multimodal integration',
    tier: 'pro',
    requiresInternet: true,
    mobileOptimized: false
  },

  'synova-quantum-nexus': {
    id: 'synova-quantum-nexus',
    name: 'Synova Quantum Nexus',
    version: '1.0.0',
    baseModel: 'llama3:70b-instruct',
    contextWindow: 32768,
    maxTokens: 8192,
    temperature: 0.5,
    topP: 0.8,
    topK: 30,
    repeatPenalty: 1.2,
    capabilities: ['text', 'quantum-reasoning', 'deep-analysis', 'strategic', 'research'],
    specialization: 'quantum-nexus',
    description: 'Quantum nexus model with maximum reasoning and strategic capabilities',
    tier: 'ultra',
    requiresInternet: true,
    mobileOptimized: false
  },

  // Specialized Models
  'synova-nexus-pro': {
    id: 'synova-nexus-pro',
    name: 'Synova Nexus Pro',
    version: '1.0.0',
    baseModel: 'llama3:70b-instruct',
    contextWindow: 16384,
    maxTokens: 6144,
    temperature: 0.6,
    topP: 0.85,
    topK: 35,
    repeatPenalty: 1.15,
    capabilities: ['text', 'advanced-reasoning', 'professional', 'multimodal', 'enterprise'],
    specialization: 'professional',
    description: 'Professional-grade model with enhanced Supanova, Astranova, Voice, and XR capabilities',
    tier: 'pro',
    requiresInternet: true,
    mobileOptimized: false
  },

  'synova-nexus-ultra': {
    id: 'synova-nexus-ultra',
    name: 'Synova Nexus Ultra',
    version: '1.0.0',
    baseModel: 'llama3:70b-instruct',
    contextWindow: 32768,
    maxTokens: 8192,
    temperature: 0.5,
    topP: 0.8,
    topK: 30,
    repeatPenalty: 1.2,
    capabilities: ['text', 'ultra-reasoning', 'frontier', 'multimodal', 'quantum', 'predictive'],
    specialization: 'ultra-frontier',
    description: 'Ultimate frontier model with maximum capability and quantum-inspired reasoning',
    tier: 'ultra',
    requiresInternet: true,
    mobileOptimized: false
  },

  'synova-nexus-voice': {
    id: 'synova-nexus-voice',
    name: 'Synova Nexus Voice',
    version: '1.0.0',
    baseModel: 'llama3:8b-instruct',
    contextWindow: 8192,
    maxTokens: 4096,
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
    capabilities: ['voice', 'speech-recognition', 'synthesis', 'emotion', 'multilingual'],
    specialization: 'voice-specialized',
    description: 'Specialized voice AI model with emotion recognition and synthesis capabilities',
    tier: 'standard',
    requiresInternet: false,
    mobileOptimized: true
  },

  'synova-nexus-xr': {
    id: 'synova-nexus-xr',
    name: 'Synova Nexus XR',
    version: '1.0.0',
    baseModel: 'llama3:8b-instruct',
    contextWindow: 16384,
    maxTokens: 6144,
    temperature: 0.6,
    topP: 0.85,
    topK: 35,
    repeatPenalty: 1.15,
    capabilities: ['xr', 'ar', 'vr', 'spatial', '3d', 'immersive'],
    specialization: 'xr-specialized',
    description: 'Extended reality AI model with spatial computing and immersive capabilities',
    tier: 'standard',
    requiresInternet: false,
    mobileOptimized: true
  }
};

// Helper functions
export function getModelConfig(modelId: string): ModelConfig | undefined {
  return MODEL_REGISTRY[modelId];
}

export function getModelsByTier(tier: 'standard' | 'pro' | 'ultra'): ModelConfig[] {
  return Object.values(MODEL_REGISTRY).filter(model => model.tier === tier);
}

export function getMobileOptimizedModels(): ModelConfig[] {
  return Object.values(MODEL_REGISTRY).filter(model => model.mobileOptimized);
}

export function getAllModelIds(): string[] {
  return Object.keys(MODEL_REGISTRY);
}

export function getDefaultModel(): ModelConfig {
  return MODEL_REGISTRY['synova-nexus'];
}

export default MODEL_REGISTRY;
