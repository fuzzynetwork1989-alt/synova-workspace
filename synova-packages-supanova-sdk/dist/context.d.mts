import { r as ContextEmitter$1, C as ContextEvent, b as AppContext, E as EventCallback } from './index-98edcafd.js';

/**
 * Context Management and Event Emission
 */

declare class ContextEmitter implements ContextEmitter$1 {
    private eventEmitter;
    private sessionId;
    private eventQueue;
    private maxQueueSize;
    private subscribers;
    constructor(maxQueueSize?: number);
    /**
     * Add event listener
     */
    on(event: string, listener: (...args: any[]) => void): this;
    /**
     * Remove event listener
     */
    off(event: string, listener: (...args: any[]) => void): this;
    /**
     * Emit event to internal emitter
     */
    private emitEvent;
    /**
     * Generate a unique session ID
     */
    private generateSessionId;
    /**
     * Emit a context event
     */
    emit(event: Omit<ContextEvent, 'timestamp' | 'session_id'>): void;
    /**
     * Emit route change event
     */
    emitRouteChange(route: string, params?: Record<string, any>): void;
    /**
     * Emit entity selection event
     */
    emitEntitySelection(entityIds: string[], entityType: string): void;
    /**
     * Emit user action event
     */
    emitUserAction(action: string, target: string, data?: Record<string, any>): void;
    /**
     * Emit system error event
     */
    emitSystemError(error: Error, context?: string): void;
    /**
     * Emit search query event
     */
    emitSearchQuery(query: string, results?: any): void;
    /**
     * Emit data loaded event
     */
    emitDataLoaded(source: string, count: number, metadata?: Record<string, any>): void;
    /**
     * Get current app context snapshot
     */
    getCurrentContext(): AppContext;
    /**
     * Subscribe to context events
     */
    subscribe(callback: EventCallback): () => void;
    /**
     * Get event history
     */
    getEventHistory(limit?: number): ContextEvent[];
    /**
     * Get events by type
     */
    getEventsByType(type: string, limit?: number): ContextEvent[];
    /**
     * Clear event history
     */
    clearHistory(): void;
    /**
     * Get session ID
     */
    getSessionId(): string;
    /**
     * Reset session (generate new session ID)
     */
    resetSession(): void;
    /**
     * Add event to queue with size management
     */
    private addToQueue;
    /**
     * Notify all subscribers
     */
    private notifySubscribers;
    /**
     * Extract current route from recent events
     */
    private getCurrentRoute;
    /**
     * Extract selected entities from recent events
     */
    private getSelectedEntities;
    /**
     * Extract user intent from recent events
     */
    private getUserIntent;
    /**
     * Extract system state from recent events
     */
    private getSystemState;
    /**
     * Get metadata
     */
    private getMetadata;
    /**
     * Get context statistics
     */
    getStatistics(): {
        total_events: number;
        events_by_type: Record<string, number>;
        session_duration: number;
        last_event_time: string | null;
    };
}
/**
 * Context validation utilities
 */
declare class ContextValidator {
    /**
     * Validate context event structure
     */
    static validateEvent(event: ContextEvent): boolean;
    /**
     * Validate app context structure
     */
    static validateAppContext(context: AppContext): boolean;
}
/**
 * Context analytics utilities
 */
declare class ContextAnalytics {
    /**
     * Analyze user behavior patterns
     */
    static analyzeUserBehavior(events: ContextEvent[]): {
        most_used_tools: Array<{
            tool: string;
            count: number;
        }>;
        common_actions: Array<{
            action: string;
            count: number;
        }>;
        session_patterns: {
            average_session_duration: number;
            typical_actions_per_session: number;
        };
    };
    /**
     * Generate context insights
     */
    static generateInsights(context: AppContext, events: ContextEvent[]): string[];
}

export { ContextAnalytics, ContextEmitter, ContextValidator, ContextEmitter as default };
