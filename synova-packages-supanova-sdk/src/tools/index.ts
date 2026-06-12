/**
 * Tool Registry and Management
 */

import { EventEmitter } from 'eventemitter3';
import { v4 as uuidv4 } from 'uuid';
import { 
  ToolRegistry, 
  ToolHandler, 
  ToolRequest, 
  ToolResponse,
  ToolMiddleware,
  ErrorHandler
} from '../types';

export class ToolManager extends EventEmitter {
  private tools: ToolRegistry = {};
  private middleware: ToolMiddleware[] = [];
  private errorHandler?: ErrorHandler;

  // Index signature to implement ToolRegistry
  [key: string]: ToolHandler | undefined | any;

  /**
   * Register a new tool
   */
  registerTool(name: string, handler: ToolHandler): void {
    if (this.tools[name]) {
      throw new Error(`Tool '${name}' is already registered`);
    }

    this.tools[name] = handler;
    this.emit('tool:registered', { name, handler });
  }

  /**
   * Unregister a tool
   */
  unregisterTool(name: string): void {
    if (!this.tools[name]) {
      throw new Error(`Tool '${name}' is not registered`);
    }

    delete this.tools[name];
    this.emit('tool:unregistered', { name });
  }

  /**
   * Get a tool handler
   */
  getTool(name: string): ToolHandler | undefined {
    return this.tools[name];
  }

  /**
   * Get all registered tool names
   */
  getToolNames(): string[] {
    return Object.keys(this.tools);
  }

  /**
   * Check if a tool is registered
   */
  hasTool(name: string): boolean {
    return name in this.tools;
  }

  /**
   * Execute a tool with middleware support
   */
  async executeTool(request: ToolRequest): Promise<ToolResponse> {
    const startTime = Date.now();
    
    try {
      // Validate request
      this.validateRequest(request);

      // Check if tool exists
      const handler = this.tools[request.tool];
      if (!handler) {
        throw new Error(`Tool '${request.tool}' is not registered`);
      }

      // Execute middleware chain
      let response = await this.executeMiddleware(request, async () => {
        return await handler(request);
      });

      // Add execution metadata
      response.metadata = {
        ...response.metadata,
        execution_time: Date.now() - startTime,
      };

      this.emit('tool:executed', { request, response });
      return response;

    } catch (error) {
      const errorResponse = this.handleError(error as Error, request);
      errorResponse.metadata = {
        ...errorResponse.metadata,
        execution_time: Date.now() - startTime,
      };
      
      this.emit('tool:error', { request, error: errorResponse });
      return errorResponse;
    }
  }

  /**
   * Add middleware to the execution chain
   */
  use(middleware: ToolMiddleware): void {
    this.middleware.push(middleware);
  }

  /**
   * Set global error handler
   */
  setErrorHandler(handler: ErrorHandler): void {
    this.errorHandler = handler;
  }

  /**
   * Execute middleware chain
   */
  private async executeMiddleware(
    request: ToolRequest, 
    finalHandler: () => Promise<ToolResponse>
  ): Promise<ToolResponse> {
    let index = 0;

    const next = async (): Promise<ToolResponse> => {
      if (index >= this.middleware.length) {
        return await finalHandler();
      }

      const middleware = this.middleware[index++];
      return await middleware(request, next);
    };

    return await next();
  }

  /**
   * Validate tool request
   */
  private validateRequest(request: ToolRequest): void {
    if (!request.tool) {
      throw new Error('Tool name is required');
    }

    if (!request.request_id) {
      throw new Error('Request ID is required');
    }

    if (!request.actor || !request.actor.user_id) {
      throw new Error('Actor information is required');
    }

    if (!request.context) {
      throw new Error('Context information is required');
    }

    // Validate request_id format
    if (!/^[a-f0-9-]{36}$/.test(request.request_id)) {
      throw new Error('Invalid request ID format');
    }
  }

  /**
   * Handle errors during tool execution
   */
  private handleError(error: Error, request: ToolRequest): ToolResponse {
    if (this.errorHandler) {
      return this.errorHandler(error, request);
    }

    return {
      request_id: request.request_id,
      success: false,
      error: error.message,
    };
  }

  /**
   * Create a standard tool request
   */
  static createRequest(
    toolName: string,
    args: Record<string, any>,
    actor: ToolRequest['actor'],
    context: ToolRequest['context']
  ): ToolRequest {
    return {
      tool: toolName,
      request_id: uuidv4(),
      actor,
      context,
      args,
    };
  }

  /**
   * Create a successful tool response
   */
  static createSuccessResponse(
    requestId: string,
    data: any,
    metadata?: ToolResponse['metadata']
  ): ToolResponse {
    return {
      request_id: requestId,
      success: true,
      data,
      metadata,
    };
  }

  /**
   * Create an error tool response
   */
  static createErrorResponse(
    requestId: string,
    error: string,
    metadata?: ToolResponse['metadata']
  ): ToolResponse {
    return {
      request_id: requestId,
      success: false,
      error,
      metadata,
    };
  }

  /**
   * Create a confirmation response
   */
  static createConfirmationResponse(
    requestId: string,
    message: string,
    metadata?: ToolResponse['metadata']
  ): ToolResponse {
    return {
      request_id: requestId,
      success: false,
      requires_confirmation: true,
      error: message,
      metadata,
    };
  }
}

/**
 * Built-in middleware for common functionality
 */

export const loggingMiddleware: ToolMiddleware = async (request, next) => {
  console.log(`[Tool] Executing ${request.tool} for user ${request.actor.user_id}`);
  const response = await next();
  console.log(`[Tool] ${request.tool} ${response.success ? 'succeeded' : 'failed'}`);
  return response;
};

export const rateLimitMiddleware = (rateLimiter: any): ToolMiddleware => {
  return async (request, next) => {
    const key = `${request.actor.user_id}:${request.tool}`;
    
    // Check rate limit
    const allowed = await rateLimiter.checkLimit(key, 60, 60000); // 60 requests per minute
    
    if (!allowed) {
      return ToolManager.createErrorResponse(
        request.request_id,
        'Rate limit exceeded'
      );
    }

    const response = await next();
    
    // Add rate limit info to response
    if (response.metadata) {
      response.metadata.rate_limit_remaining = await rateLimiter.getRemainingRequests(key);
    }

    return response;
  };
};

export const validationMiddleware: ToolMiddleware = async (request, next) => {
  // Validate input arguments
  if (request.args && typeof request.args === 'object') {
    // Basic validation - can be extended with JSON schemas
    for (const [key, value] of Object.entries(request.args)) {
      if (typeof value === 'string' && value.length > 10000) {
        return ToolManager.createErrorResponse(
          request.request_id,
          `Argument '${key}' exceeds maximum length`
        );
      }
    }
  }

  return await next();
};

export const auditMiddleware: ToolMiddleware = async (request, next) => {
  const startTime = Date.now();
  const response = await next();
  const executionTime = Date.now() - startTime;

  // Log audit information
  console.log(`[Audit] Tool: ${request.tool}, User: ${request.actor.user_id}, Success: ${response.success}, Duration: ${executionTime}ms`);

  return response;
};

// Export the ToolManager as default
export default ToolManager;
