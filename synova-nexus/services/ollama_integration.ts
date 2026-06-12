// Ollama Integration Service for Enhanced Synova Brain
// Provides seamless integration with Ollama local model server

import { EventEmitter } from 'events';
import fetch from 'node-fetch';

export interface OllamaModelInfo {
  name: string;
  model: string;
  modified_at: string;
  size: number;
  digest: string;
  details: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
}

export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  system?: string;
  context?: number[];
  options?: {
    temperature?: number;
    top_p?: number;
    top_k?: number;
    repeat_penalty?: number;
    predict?: number;
    num_ctx?: number;
    num_batch?: number;
    num_keep?: number;
    seed?: number;
    tfs_z?: number;
    typical_p?: number;
    repeat_last_n?: number;
    use_mmap?: boolean;
    use_mlock?: boolean;
    embedding_only?: boolean;
    rope_frequency_base?: number;
    rope_frequency_scale?: number;
    num_gpu?: number;
    num_thread?: number;
    main_gpu?: number;
    low_vram?: boolean;
    f16_kv?: boolean;
    logits_all?: boolean;
    vocab_only?: boolean;
  };
  format?: string;
  template?: string;
  stream?: boolean;
  raw?: boolean;
  keep_alive?: string;
}

export interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface OllamaChatRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  format?: string;
  options?: OllamaGenerateRequest['options'];
  stream?: boolean;
  keep_alive?: string;
}

export interface OllamaChatResponse {
  model: string;
  created_at: string;
  message: {
    role: 'assistant';
    content: string;
  };
  done: boolean;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface OllamaConfig {
  host: string;
  port: number;
  timeout: number;
  max_retries: number;
  retry_delay: number;
  default_model: string;
  fallback_models: string[];
}

export class OllamaIntegration extends EventEmitter {
  private config: OllamaConfig;
  private is_connected: boolean = false;
  private available_models: Map<string, OllamaModelInfo> = new Map();
  private request_cache: Map<string, any> = new Map();
  private health_check_interval: NodeJS.Timeout | null = null;

  constructor(config?: Partial<OllamaConfig>) {
    super();

    this.config = {
      host: config?.host || 'localhost',
      port: config?.port || 11434,
      timeout: config?.timeout || 30000,
      max_retries: config?.max_retries || 3,
      retry_delay: config?.retry_delay || 1000,
      default_model: config?.default_model || 'llama2',
      fallback_models: config?.fallback_models || ['llama2', 'mistral', 'codellama']
    };
  }

  // Connection Management
  async connect(): Promise<void> {
    try {
      await this.testConnection();
      await this.loadAvailableModels();
      this.is_connected = true;
      this.startHealthCheck();

      this.emit('connected', {
        models: Array.from(this.available_models.keys()),
        default_model: this.config.default_model
      });

      console.log('✅ Ollama integration connected successfully');
    } catch (error) {
      console.error('❌ Failed to connect to Ollama:', error);
      this.is_connected = false;
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.is_connected = false;
    if (this.health_check_interval) {
      clearInterval(this.health_check_interval);
      this.health_check_interval = null;
    }

    this.emit('disconnected');
    console.log('🔌 Ollama integration disconnected');
  }

  private async testConnection(): Promise<void> {
    const url = `http://${this.config.host}:${this.config.port}/api/tags`;

    const response = await fetch(url, {
      method: 'GET',
      timeout: this.config.timeout
    });

    if (!response.ok) {
      throw new Error(`Ollama connection failed: ${response.status} ${response.statusText}`);
    }
  }

  private async loadAvailableModels(): Promise<void> {
    const url = `http://${this.config.host}:${this.config.port}/api/tags`;

    const response = await fetch(url, {
      method: 'GET',
      timeout: this.config.timeout
    });

    if (!response.ok) {
      throw new Error(`Failed to load models: ${response.status}`);
    }

    const data = await response.json() as { models: OllamaModelInfo[] };

    this.available_models.clear();
    for (const model of data.models) {
      this.available_models.set(model.name, model);
    }

    console.log(`📦 Loaded ${this.available_models.size} Ollama models`);
  }

  private startHealthCheck(): void {
    this.health_check_interval = setInterval(async () => {
      try {
        await this.testConnection();
        if (!this.is_connected) {
          this.is_connected = true;
          this.emit('reconnected');
        }
      } catch (error) {
        if (this.is_connected) {
          this.is_connected = false;
          this.emit('disconnected', error);
        }
      }
    }, 30000); // Check every 30 seconds
  }

  // Model Operations
  async pullModel(modelName: string): Promise<void> {
    const url = `http://${this.config.host}:${this.config.port}/api/pull`;

    console.log(`📥 Pulling model: ${modelName}`);

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: modelName }),
      timeout: 300000 // 5 minutes for model download
    });

    if (!response.ok) {
      throw new Error(`Failed to pull model ${modelName}: ${response.status}`);
    }

    // Reload models after pulling
    await this.loadAvailableModels();

    this.emit('model_pulled', { model: modelName });
    console.log(`✅ Model pulled successfully: ${modelName}`);
  }

  async deleteModel(modelName: string): Promise<void> {
    const url = `http://${this.config.host}:${this.config.port}/api/delete`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: modelName }),
      timeout: this.config.timeout
    });

    if (!response.ok) {
      throw new Error(`Failed to delete model ${modelName}: ${response.status}`);
    }

    this.available_models.delete(modelName);

    this.emit('model_deleted', { model: modelName });
    console.log(`🗑️ Model deleted: ${modelName}`);
  }

  // Text Generation
  async generate(request: OllamaGenerateRequest): Promise<OllamaGenerateResponse> {
    const model = request.model || this.config.default_model;

    // Validate model availability
    if (!this.available_models.has(model)) {
      throw new Error(`Model ${model} not available. Available models: ${Array.from(this.available_models.keys()).join(', ')}`);
    }

    const url = `http://${this.config.host}:${this.config.port}/api/generate`;

    // Prepare request with defaults
    const enhanced_request: OllamaGenerateRequest = {
      model,
      prompt: request.prompt,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        top_k: 40,
        num_ctx: 4096,
        ...request.options
      },
      stream: false,
      keep_alive: '1h'
    };

    // Add optional properties if they exist
    if (request.system !== undefined) enhanced_request.system = request.system;
    if (request.context !== undefined) enhanced_request.context = request.context;
    if (request.format !== undefined) enhanced_request.format = request.format;
    if (request.template !== undefined) enhanced_request.template = request.template;
    if (request.raw !== undefined) enhanced_request.raw = request.raw;

    // Check cache
    const cache_key = this.generateCacheKey(enhanced_request);
    const cached = this.request_cache.get(cache_key);
    if (cached) {
      this.emit('cache_hit', { request: enhanced_request, response: cached });
      return cached;
    }

    try {
      const response = await this.executeWithRetry(() =>
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(enhanced_request),
          timeout: this.config.timeout
        })
      );

      if (!response.ok) {
        throw new Error(`Generation failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json() as OllamaGenerateResponse;

      // Cache result
      this.request_cache.set(cache_key, result);

      // Clean old cache entries
      if (this.request_cache.size > 100) {
        const first_key = this.request_cache.keys().next().value;
        this.request_cache.delete(first_key);
      }

      this.emit('generation_completed', { request: enhanced_request, response: result });
      return result;

    } catch (error) {
      this.emit('generation_error', { request: enhanced_request, error });
      throw error;
    }
  }

  async *generateStream(request: OllamaGenerateRequest): AsyncGenerator<OllamaGenerateResponse> {
    const model = request.model || this.config.default_model;

    if (!this.available_models.has(model)) {
      throw new Error(`Model ${model} not available`);
    }

    const url = `http://${this.config.host}:${this.config.port}/api/generate`;

    const enhanced_request: OllamaGenerateRequest = {
      model,
      prompt: request.prompt,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        top_k: 40,
        num_ctx: 4096,
        ...request.options
      },
      stream: true,
      keep_alive: '1h'
    };

    // Add optional properties if they exist
    if (request.system !== undefined) enhanced_request.system = request.system;
    if (request.context !== undefined) enhanced_request.context = request.context;
    if (request.format !== undefined) enhanced_request.format = request.format;
    if (request.template !== undefined) enhanced_request.template = request.template;
    if (request.raw !== undefined) enhanced_request.raw = request.raw;

    try {
      const response = await this.executeWithRetry(() =>
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(enhanced_request),
          timeout: this.config.timeout
        })
      );

      if (!response.ok) {
        throw new Error(`Stream generation failed: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const chunk = JSON.parse(line) as OllamaGenerateResponse;
              this.emit('stream_chunk', { request: enhanced_request, chunk });
              yield chunk;

              if (chunk.done) {
                return;
              }
            } catch (parse_error) {
              console.warn('Failed to parse stream chunk:', line, parse_error);
            }
          }
        }
      }

    } catch (error) {
      this.emit('stream_error', { request: enhanced_request, error });
      throw error;
    }
  }

  // Chat Interface
  async chat(request: OllamaChatRequest): Promise<OllamaChatResponse> {
    const model = request.model || this.config.default_model;

    if (!this.available_models.has(model)) {
      throw new Error(`Model ${model} not available`);
    }

    const url = `http://${this.config.host}:${this.config.port}/api/chat`;

    const enhanced_request: OllamaChatRequest = {
      model,
      messages: request.messages,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        top_k: 40,
        num_ctx: 4096,
        ...request.options
      },
      stream: false,
      keep_alive: '1h'
    };

    // Add optional properties if they exist
    if (request.format !== undefined) enhanced_request.format = request.format;

    try {
      const response = await this.executeWithRetry(() =>
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(enhanced_request),
          timeout: this.config.timeout
        })
      );

      if (!response.ok) {
        throw new Error(`Chat failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json() as OllamaChatResponse;

      this.emit('chat_completed', { request: enhanced_request, response: result });
      return result;

    } catch (error) {
      this.emit('chat_error', { request: enhanced_request, error });
      throw error;
    }
  }

  async *chatStream(request: OllamaChatRequest): AsyncGenerator<OllamaChatResponse> {
    const model = request.model || this.config.default_model;

    if (!this.available_models.has(model)) {
      throw new Error(`Model ${model} not available`);
    }

    const url = `http://${this.config.host}:${this.config.port}/api/chat`;

    const enhanced_request: OllamaChatRequest = {
      model,
      messages: request.messages,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        top_k: 40,
        num_ctx: 4096,
        ...request.options
      },
      stream: true,
      keep_alive: '1h'
    };

    // Add optional properties if they exist
    if (request.format !== undefined) enhanced_request.format = request.format;

    try {
      const response = await this.executeWithRetry(() =>
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(enhanced_request),
          timeout: this.config.timeout
        })
      );

      if (!response.ok) {
        throw new Error(`Chat stream failed: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader available');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let full_content = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            try {
              const chunk = JSON.parse(line) as OllamaChatResponse;

              if (chunk.message?.content) {
                full_content += chunk.message.content;
              }

              this.emit('chat_stream_chunk', { request: enhanced_request, chunk });
              yield chunk;

              if (chunk.done) {
                // Emit final complete message
                const final_response: OllamaChatResponse = {
                  ...chunk,
                  message: {
                    role: 'assistant',
                    content: full_content
                  }
                };
                this.emit('chat_completed', { request: enhanced_request, response: final_response });
                return;
              }
            } catch (parse_error) {
              console.warn('Failed to parse chat stream chunk:', line, parse_error);
            }
          }
        }
      }

    } catch (error) {
      this.emit('chat_stream_error', { request: enhanced_request, error });
      throw error;
    }
  }

  // Utility Methods
  private async executeWithRetry<T>(operation: () => Promise<T>): Promise<T> {
    let last_error: Error | null = null;

    for (let attempt = 1; attempt <= this.config.max_retries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        last_error = error as Error;

        if (attempt < this.config.max_retries) {
          console.warn(`⚠️ Ollama operation failed (attempt ${attempt}/${this.config.max_retries}), retrying...`, error);
          await new Promise(resolve => setTimeout(resolve, this.config.retry_delay * attempt));
        }
      }
    }

    throw last_error;
  }

  private generateCacheKey(request: OllamaGenerateRequest): string {
    return `${request.model}_${request.prompt.substring(0, 100)}_${JSON.stringify(request.options)}`;
  }

  // Status and Information
  isConnected(): boolean {
    return this.is_connected;
  }

  getAvailableModels(): string[] {
    return Array.from(this.available_models.keys());
  }

  getModelInfo(modelName: string): OllamaModelInfo | undefined {
    return this.available_models.get(modelName);
  }

  getDefaultModel(): string {
    return this.config.default_model;
  }

  async getSystemStats(): Promise<any> {
    const url = `http://${this.config.host}:${this.config.port}/api/ps`;

    try {
      const response = await fetch(url, { timeout: this.config.timeout });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn('Failed to get system stats:', error);
    }

    return null;
  }

  async healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy'; details: any }> {
    try {
      await this.testConnection();

      const stats = await this.getSystemStats();
      const model_count = this.available_models.size;

      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

      if (model_count === 0) {
        status = 'unhealthy';
      } else if (model_count < 2 || !stats) {
        status = 'degraded';
      }

      return {
        status,
        details: {
          connected: true,
          models_available: model_count,
          system_stats: stats,
          default_model: this.config.default_model
        }
      };

    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          connected: false,
          error: (error as Error).message
        }
      };
    }
  }

  // Configuration
  updateConfig(new_config: Partial<OllamaConfig>): void {
    this.config = { ...this.config, ...new_config };
    this.emit('config_updated', this.config);
  }

  getConfig(): OllamaConfig {
    return { ...this.config };
  }

  clearCache(): void {
    this.request_cache.clear();
    this.emit('cache_cleared');
  }

  getCacheSize(): number {
    return this.request_cache.size;
  }
}

export default OllamaIntegration;
