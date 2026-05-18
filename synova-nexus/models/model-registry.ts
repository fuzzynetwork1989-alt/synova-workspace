// Synova Nexus Model Registry
// Comprehensive model configuration for all Synova AI models

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
  modelfile: string;
  description: string;
  tier: 'standard' | 'pro' | 'ultra';
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
    modelfile: 'Modelfile',
    description: 'Advanced AI assistant with integrated Supanova, Astranova, Voice, and XR capabilities',
    tier: 'standard'
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
    modelfile: 'Modelfile_Synova_Nexus_Enhanced',
    description: 'Advanced cognitive model with superior reasoning, creativity, and analytical capabilities',
    tier: 'standard'
  },

  // Revolutionary Models (Root Directory)
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
    modelfile: 'Modelfile_Synova_DeepSeek_Quantum',
    description: 'Quantum-enhanced coding model with advanced reasoning and optimization',
    tier: 'pro'
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
    modelfile: 'Modelfile_Synova_Gemma4_Quantum',
    description: 'Quantum-enhanced multimodal model with advanced reasoning capabilities',
    tier: 'pro'
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
    modelfile: 'Modelfile_Synova_Gemma4_Quantum_Elite',
    description: 'Elite quantum-enhanced model with maximum reasoning and creative capabilities',
    tier: 'ultra'
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
    modelfile: 'Modelfile_Synova_Neural_Quantum',
    description: 'Neural network enhanced quantum model with adaptive learning capabilities',
    tier: 'pro'
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
    modelfile: 'Modelfile_Synova_Omni_Nexus',
    description: 'Omni-capable model with comprehensive multimodal integration',
    tier: 'pro'
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
    modelfile: 'Modelfile_Synova_Quantum_Nexus',
    description: 'Quantum nexus model with maximum reasoning and strategic capabilities',
    tier: 'ultra'
  },

  // Specialized Models (synova-nexus/models)
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
    modelfile: 'Modelfile_Synova_Nexus_Pro',
    description: 'Professional-grade model with enhanced Supanova, Astranova, Voice, and XR capabilities',
    tier: 'pro'
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
    modelfile: 'Modelfile_Synova_Nexus_Ultra',
    description: 'Ultimate frontier model with maximum capability and quantum-inspired reasoning',
    tier: 'ultra'
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
    modelfile: 'Modelfile_Synova_Nexus_Voice',
    description: 'Specialized voice AI model with emotion recognition and synthesis capabilities',
    tier: 'standard'
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
    modelfile: 'Modelfile_Synova_Nexus_XR',
    description: 'Extended reality AI model with spatial computing and immersive capabilities',
    tier: 'standard'
  }
};

// Helper functions
export function getModelConfig(modelId: string): ModelConfig | undefined {
  return MODEL_REGISTRY[modelId];
}

export function getModelsByTier(tier: 'standard' | 'pro' | 'ultra'): ModelConfig[] {
  return Object.values(MODEL_REGISTRY).filter(model => model.tier === tier);
}

export function getModelsByCapability(capability: string): ModelConfig[] {
  return Object.values(MODEL_REGISTRY).filter(model => 
    model.capabilities.includes(capability)
  );
}

export function getAllModelIds(): string[] {
  return Object.keys(MODEL_REGISTRY);
}

export function getDefaultModel(): ModelConfig {
  return MODEL_REGISTRY['synova-nexus'];
}

export default MODEL_REGISTRY;
