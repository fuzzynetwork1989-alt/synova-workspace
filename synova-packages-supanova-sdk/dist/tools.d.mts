import { EventEmitter } from 'eventemitter3';
import { k as ToolHandler, h as ToolRequest, T as ToolResponse, p as ToolMiddleware, q as ErrorHandler } from './index-98edcafd.js';

/**
 * Tool Registry and Management
 */

declare class ToolManager extends EventEmitter {
    private tools;
    private middleware;
    private errorHandler?;
    [key: string]: ToolHandler | undefined | any;
    /**
     * Register a new tool
     */
    registerTool(name: string, handler: ToolHandler): void;
    /**
     * Unregister a tool
     */
    unregisterTool(name: string): void;
    /**
     * Get a tool handler
     */
    getTool(name: string): ToolHandler | undefined;
    /**
     * Get all registered tool names
     */
    getToolNames(): string[];
    /**
     * Check if a tool is registered
     */
    hasTool(name: string): boolean;
    /**
     * Execute a tool with middleware support
     */
    executeTool(request: ToolRequest): Promise<ToolResponse>;
    /**
     * Add middleware to the execution chain
     */
    use(middleware: ToolMiddleware): void;
    /**
     * Set global error handler
     */
    setErrorHandler(handler: ErrorHandler): void;
    /**
     * Execute middleware chain
     */
    private executeMiddleware;
    /**
     * Validate tool request
     */
    private validateRequest;
    /**
     * Handle errors during tool execution
     */
    private handleError;
    /**
     * Create a standard tool request
     */
    static createRequest(toolName: string, args: Record<string, any>, actor: ToolRequest['actor'], context: ToolRequest['context']): ToolRequest;
    /**
     * Create a successful tool response
     */
    static createSuccessResponse(requestId: string, data: any, metadata?: ToolResponse['metadata']): ToolResponse;
    /**
     * Create an error tool response
     */
    static createErrorResponse(requestId: string, error: string, metadata?: ToolResponse['metadata']): ToolResponse;
    /**
     * Create a confirmation response
     */
    static createConfirmationResponse(requestId: string, message: string, metadata?: ToolResponse['metadata']): ToolResponse;
}
/**
 * Built-in middleware for common functionality
 */
declare const loggingMiddleware: ToolMiddleware;
declare const rateLimitMiddleware: (rateLimiter: any) => ToolMiddleware;
declare const validationMiddleware: ToolMiddleware;
declare const auditMiddleware: ToolMiddleware;

export { ToolManager, auditMiddleware, ToolManager as default, loggingMiddleware, rateLimitMiddleware, validationMiddleware };
