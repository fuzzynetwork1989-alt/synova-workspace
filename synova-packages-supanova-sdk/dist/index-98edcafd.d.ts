/**
 * Core type definitions for Supanova SDK
 */
interface ToolRequest {
    tool: string;
    request_id: string;
    actor: {
        user_id: string;
        role: string;
        session_id?: string;
    };
    context: {
        route: string;
        selected_ids: string[];
        app_version?: string;
        screen_size?: string;
    };
    args: Record<string, any>;
}
interface ToolResponse {
    request_id: string;
    success: boolean;
    data?: any;
    error?: string;
    requires_confirmation?: boolean;
    metadata?: {
        execution_time?: number;
        permissions_checked?: string[];
        rate_limit_remaining?: number;
    };
}
interface ContextEvent {
    type: string;
    timestamp: string;
    user_id?: string;
    session_id: string;
    data: Record<string, any>;
}
interface AppContext {
    current_route: string;
    selected_entities: string[];
    user_intent: {
        search_query?: string;
        action_type?: string;
        recent_actions: string[];
    };
    system_state: {
        loading: boolean;
        error_count: number;
        last_error?: string;
    };
    metadata: {
        app_version: string;
        screen_size: string;
        user_agent: string;
    };
}
interface ToolPermission {
    requires_confirmation: boolean;
    allowed_roles: string[];
    rate_limit: {
        requests_per_minute: number;
        burst: number;
    };
    data_access: 'none' | 'read_only' | 'limited_write' | 'full_access';
    destructive_actions?: {
        [action: string]: 'confirmation_required' | 'auto_allowed' | 'disabled';
    };
}
interface SupanovaConfig {
    api_url: string;
    api_key: string;
    app_name: string;
    app_version: string;
    permissions: Record<string, ToolPermission>;
    features: {
        context_feed: boolean;
        memory_aware: boolean;
        mode_adaptive: boolean;
    };
    security: {
        validate_inputs: boolean;
        sanitize_outputs: boolean;
        audit_all_actions: boolean;
    };
    autopilot?: {
        enabled: boolean;
        auto_confirm_safe_actions: boolean;
        learning_enabled: boolean;
        max_autonomous_actions: number;
        risk_threshold: 'low' | 'medium' | 'high';
        allowed_actions: string[];
        blocked_actions: string[];
    };
}
interface SupanovaManifest {
    app_name: string;
    app_slug: string;
    version: string;
    supanova_version: string;
    capabilities: {
        context_aware: boolean;
        action_capable: boolean;
        mode_adaptive: boolean;
        memory_aware: boolean;
    };
    assistant_modes: Record<string, string>;
    tools: string[];
    permissions: {
        destructive_actions: 'confirmation_required' | 'auto_allowed' | 'disabled';
        data_access: 'none' | 'read_only' | 'limited_write' | 'full_access';
        external_calls: 'disabled' | 'restricted' | 'allowed';
    };
    context_sources: string[];
    ui_requirements: {
        persistent_surface: boolean;
        context_chips: boolean;
        one_tap_actions: boolean;
        permission_gates: boolean;
    };
}
interface ToolRegistry {
    [toolName: string]: ToolHandler;
}
interface ToolHandler {
    (request: ToolRequest): Promise<ToolResponse>;
}
interface PermissionCheckResult {
    allowed: boolean;
    reason?: string;
    requires_confirmation?: boolean;
    rate_limit_remaining?: number;
}
interface ContextEmitter {
    emit(event: Omit<ContextEvent, 'timestamp' | 'session_id'>): void;
    emitRouteChange(route: string, params?: Record<string, any>): void;
    emitEntitySelection(entityIds: string[], entityType: string): void;
    emitUserAction(action: string, target: string, data?: Record<string, any>): void;
    emitSystemError(error: Error, context?: string): void;
    getCurrentContext(): AppContext;
    subscribe(callback: (event: ContextEvent) => void): () => void;
    getEventHistory(limit?: number): ContextEvent[];
    clearHistory(): void;
}
interface SupanovaClient {
    config: SupanovaConfig;
    tools: ToolRegistry;
    context: ContextEmitter;
    permissions: PermissionManager;
    executeTool(toolName: string, args: Record<string, any>, context?: Partial<ToolRequest['context']>): Promise<ToolResponse>;
    checkPermission(toolName: string, actor: ToolRequest['actor']): Promise<PermissionCheckResult>;
    registerTool(name: string, handler: ToolHandler): void;
    unregisterTool(name: string): void;
    start(): Promise<void>;
    stop(): Promise<void>;
}
interface PermissionManager {
    checkPermission(toolName: string, actor: ToolRequest['actor']): Promise<PermissionCheckResult>;
    updatePermissions(toolName: string, permissions: ToolPermission): void;
    getPermissions(toolName: string): ToolPermission | undefined;
    validatePermissions(): boolean;
}
interface AuditLog {
    timestamp: string;
    user_id: string;
    session_id: string;
    tool_name: string;
    action: string;
    success: boolean;
    error?: string;
    execution_time: number;
    permissions_checked: string[];
    context: Record<string, any>;
}
interface RateLimiter {
    checkLimit(key: string, limit: number, window: number): Promise<boolean>;
    getRemainingRequests(key: string): Promise<number>;
    reset(key: string): Promise<void>;
}
interface SecurityValidator {
    validateInput(input: any, schema?: any): boolean;
    sanitizeOutput(output: any): any;
    detectThreat(input: any): boolean;
    logSecurityEvent(event: string, data: any): void;
}
interface MemoryStore {
    store(key: string, value: any, ttl?: number): Promise<void>;
    retrieve(key: string): Promise<any>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
    keys(): Promise<string[]>;
}
type AssistantMode = 'default' | 'creator' | 'utility' | 'analyst' | 'support' | 'autopilot';
interface AutopilotConfig {
    enabled: boolean;
    auto_confirm_safe_actions: boolean;
    learning_enabled: boolean;
    max_autonomous_actions: number;
    risk_threshold: 'low' | 'medium' | 'high';
    allowed_actions: string[];
    blocked_actions: string[];
}
interface AutopilotAction {
    id: string;
    tool_name: string;
    args: Record<string, any>;
    confidence: number;
    risk_level: 'low' | 'medium' | 'high';
    reason: string;
    timestamp: string;
    context: Partial<ToolRequest['context']>;
    result?: ToolResponse;
}
interface AutopilotDecision {
    action_id: string;
    decision: 'execute' | 'confirm' | 'block';
    reason: string;
    confidence: number;
    timestamp: string;
}
interface AutopilotStats {
    total_actions_analyzed: number;
    auto_executed: number;
    blocked: number;
    confirmation_requested: number;
    success_rate: number;
    average_confidence: number;
}
interface AssistantConfig {
    mode: AssistantMode;
    capabilities: string[];
    personality: string;
    instructions: string[];
    tools: string[];
    permissions: string[];
}
interface ValidationError {
    field: string;
    message: string;
    code: string;
}
interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
    warnings: ValidationError[];
}
type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
type EventCallback = (event: ContextEvent) => void;
type ToolMiddleware = (request: ToolRequest, next: () => Promise<ToolResponse>) => Promise<ToolResponse>;
type ErrorHandler = (error: Error, request: ToolRequest) => ToolResponse;

export { AutopilotConfig as A, ContextEvent as C, DeepPartial as D, EventCallback as E, MemoryStore as M, PermissionCheckResult as P, RateLimiter as R, SupanovaClient as S, ToolResponse as T, ValidationError as V, AssistantMode as a, AppContext as b, AutopilotAction as c, AutopilotDecision as d, AutopilotStats as e, SupanovaConfig as f, ToolRegistry as g, ToolRequest as h, ToolPermission as i, SupanovaManifest as j, ToolHandler as k, AuditLog as l, SecurityValidator as m, AssistantConfig as n, ValidationResult as o, ToolMiddleware as p, ErrorHandler as q, ContextEmitter as r, PermissionManager as s };
