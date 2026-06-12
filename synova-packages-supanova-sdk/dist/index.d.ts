import ToolManager from './tools.js';
export { auditMiddleware, loggingMiddleware, rateLimitMiddleware, validationMiddleware } from './tools.js';
import ContextEmitter from './context.js';
export { ContextAnalytics, ContextValidator } from './context.js';
import PermissionManager from './permissions.js';
export { PermissionPresets, SecurityUtils } from './permissions.js';
import { EventEmitter } from 'eventemitter3';
import { A as AutopilotConfig, a as AssistantMode, b as AppContext, c as AutopilotAction, d as AutopilotDecision, T as ToolResponse, e as AutopilotStats, S as SupanovaClient, f as SupanovaConfig, g as ToolRegistry, h as ToolRequest, P as PermissionCheckResult } from './index-98edcafd.js';
export { n as AssistantConfig, l as AuditLog, C as ContextEvent, D as DeepPartial, q as ErrorHandler, E as EventCallback, M as MemoryStore, R as RateLimiter, m as SecurityValidator, j as SupanovaManifest, k as ToolHandler, p as ToolMiddleware, i as ToolPermission, V as ValidationError, o as ValidationResult } from './index-98edcafd.js';

/**
 * Autopilot Manager for handling autonomous operations
 */

/**
 * Manages autonomous operations and intelligent decision making
 */
declare class AutopilotManager extends EventEmitter {
    private config;
    private isEnabled;
    private actionHistory;
    private decisionHistory;
    private currentMode;
    private autonomousActionCount;
    private lastContext;
    constructor(config: AutopilotConfig);
    /**
     * Enable autopilot mode
     */
    enable(): Promise<void>;
    /**
     * Disable autopilot mode
     */
    disable(): Promise<void>;
    /**
     * Check if autopilot is enabled
     */
    isAutopilotEnabled(): boolean;
    /**
     * Set current assistant mode
     */
    setMode(mode: AssistantMode): void;
    /**
     * Get current mode
     */
    getMode(): AssistantMode;
    /**
     * Analyze context and suggest autonomous actions
     */
    analyzeContext(context: AppContext): Promise<AutopilotAction[]>;
    /**
     * Make decision on whether to execute an action autonomously
     */
    makeDecision(action: AutopilotAction): Promise<AutopilotDecision>;
    /**
     * Execute action autonomously
     */
    executeAction(action: AutopilotAction, executor: (toolName: string, args: Record<string, any>) => Promise<ToolResponse>): Promise<ToolResponse>;
    /**
     * Get autopilot statistics
     */
    getStatistics(): AutopilotStats;
    /**
     * Reset autonomous action count (call periodically)
     */
    resetActionCount(): void;
    /**
     * Get action history
     */
    getActionHistory(): AutopilotAction[];
    /**
     * Get decision history
     */
    getDecisionHistory(): AutopilotDecision[];
    /**
     * Clear history
     */
    clearHistory(): void;
    private analyzeSearchIntent;
    private analyzeRecentActions;
    private analyzeSystemErrors;
    private filterAndRankActions;
    private createAction;
    private isActionTooRisky;
    private getMinimumConfidence;
    private learnFromAction;
}

/**
 * Main Supanova SDK entry point
 */

/**
 * Main Supanova SDK Client
 */
declare class SupanovaSDK implements SupanovaClient {
    readonly config: SupanovaConfig;
    readonly tools: ToolManager & ToolRegistry;
    readonly context: ContextEmitter;
    readonly permissions: PermissionManager;
    readonly autopilot: AutopilotManager;
    private started;
    /**
     * Get default autopilot configuration
     */
    private getDefaultAutopilotConfig;
    constructor(config: SupanovaConfig);
    /**
     * Start the Supanova SDK
     */
    start(): Promise<void>;
    /**
     * Stop the Supanova SDK
     */
    stop(): Promise<void>;
    /**
     * Execute a tool with permission checking
     */
    executeTool(toolName: string, args: Record<string, any>, context?: Partial<ToolRequest['context']>): Promise<ToolResponse>;
    /**
     * Check permission for a tool
     */
    checkPermission(toolName: string, actor: ToolRequest['actor']): Promise<PermissionCheckResult>;
    /**
     * Register a new tool
     */
    registerTool(name: string, handler: (request: ToolRequest) => Promise<ToolResponse>): void;
    /**
     * Unregister a tool
     */
    unregisterTool(name: string): void;
    /**
     * Get SDK statistics
     */
    getStatistics(): {
        tools: {
            registered: number;
            execution_count: number;
            error_count: number;
        };
        context: {
            total_events: number;
            session_duration: number;
            last_event_time: string | null;
        };
        permissions: {
            total_checks: number;
            allowed_checks: number;
            denied_checks: number;
        };
        autopilot?: AutopilotStats;
    };
    /**
     * Enable autopilot mode
     */
    enableAutopilot(): Promise<void>;
    /**
     * Disable autopilot mode
     */
    disableAutopilot(): Promise<void>;
    /**
     * Set assistant mode (including autopilot)
     */
    setAssistantMode(mode: AssistantMode): void;
    /**
     * Get current assistant mode
     */
    getAssistantMode(): AssistantMode;
    /**
     * Analyze context for autonomous actions
     */
    analyzeForAutopilot(): Promise<AutopilotAction[]>;
    /**
     * Execute autopilot action
     */
    executeAutopilotAction(action: AutopilotAction): Promise<ToolResponse>;
    /**
     * Make autopilot decision for an action
     */
    makeAutopilotDecision(action: AutopilotAction): Promise<AutopilotDecision>;
    /**
     * Validate configuration
     */
    private validateConfig;
    /**
     * Setup event listeners between components
     */
    private setupEventListeners;
    /**
     * Setup default middleware
     */
    private setupDefaultMiddleware;
    /**
     * Emit event (internal)
     */
    private emitEvent;
}
/**
 * Factory function to create Supanova SDK instance
 */
declare function createSupanovaSDK(config: SupanovaConfig): SupanovaSDK;
/**
 * Default configuration factory
 */
declare function createDefaultConfig(overrides?: Partial<SupanovaConfig>): SupanovaConfig;

export { AppContext, AssistantMode, AutopilotAction, AutopilotConfig, AutopilotDecision, AutopilotManager, AutopilotStats, ContextEmitter, PermissionCheckResult, PermissionManager, SupanovaClient, SupanovaConfig, SupanovaSDK, ToolManager, ToolRegistry, ToolRequest, ToolResponse, createDefaultConfig, createSupanovaSDK, SupanovaSDK as default };
