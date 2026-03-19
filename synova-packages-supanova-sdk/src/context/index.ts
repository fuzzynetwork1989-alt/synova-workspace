/**
 * Context Management and Event Emission
 */

import { EventEmitter } from 'eventemitter3';
import { v4 as uuidv4 } from 'uuid';
import {
  ContextEvent,
  AppContext,
  ContextEmitter as IContextEmitter,
  EventCallback
} from '../types';

export class ContextEmitter implements IContextEmitter {
  private eventEmitter: EventEmitter = new EventEmitter();
  private sessionId: string;
  private eventQueue: ContextEvent[] = [];
  private maxQueueSize: number;
  private subscribers: Map<string, EventCallback> = new Map();

  constructor(maxQueueSize: number = 1000) {
    this.sessionId = this.generateSessionId();
    this.maxQueueSize = maxQueueSize;
  }

  /**
   * Add event listener
   */
  on(event: string, listener: (...args: any[]) => void): this {
    this.eventEmitter.on(event, listener);
    return this;
  }

  /**
   * Remove event listener
   */
  off(event: string, listener: (...args: any[]) => void): this {
    this.eventEmitter.off(event, listener);
    return this;
  }

  /**
   * Emit event to internal emitter
   */
  private emitEvent(event: string, ...args: any[]): boolean {
    return this.eventEmitter.emit(event, ...args);
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Emit a context event
   */
  emit(event: Omit<ContextEvent, 'timestamp' | 'session_id'>): void {
    const fullEvent: ContextEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
    };

    this.addToQueue(fullEvent);
    this.notifySubscribers(fullEvent);
    this.emitEvent('context:event', fullEvent);
  }

  /**
   * Emit route change event
   */
  emitRouteChange(route: string, params?: Record<string, any>): void {
    this.emit({
      type: 'route_change',
      data: {
        route,
        params,
        timestamp: Date.now(),
      },
    });
  }

  /**
   * Emit entity selection event
   */
  emitEntitySelection(entityIds: string[], entityType: string): void {
    this.emit({
      type: 'entity_selection',
      data: {
        entity_ids: entityIds,
        entity_type: entityType,
        count: entityIds.length,
      },
    });
  }

  /**
   * Emit user action event
   */
  emitUserAction(action: string, target: string, data?: Record<string, any>): void {
    this.emit({
      type: 'user_action',
      data: {
        action,
        target,
        data,
        timestamp: Date.now(),
      },
    });
  }

  /**
   * Emit system error event
   */
  emitSystemError(error: Error, context?: string): void {
    this.emit({
      type: 'system_error',
      data: {
        error_message: error.message,
        error_stack: error.stack,
        context,
        timestamp: Date.now(),
      },
    });
  }

  /**
   * Emit search query event
   */
  emitSearchQuery(query: string, results?: any): void {
    this.emit({
      type: 'search_query',
      data: {
        query,
        results,
        timestamp: Date.now(),
      },
    });
  }

  /**
   * Emit data loaded event
   */
  emitDataLoaded(source: string, count: number, metadata?: Record<string, any>): void {
    this.emit({
      type: 'data_loaded',
      data: {
        source,
        count,
        metadata,
        timestamp: Date.now(),
      },
    });
  }

  /**
   * Get current app context snapshot
   */
  getCurrentContext(): AppContext {
    // This would typically integrate with the app's state management
    // For now, we'll provide a basic implementation
    const recentEvents = this.getEventHistory(100);
    
    return {
      current_route: this.getCurrentRoute(recentEvents),
      selected_entities: this.getSelectedEntities(recentEvents),
      user_intent: this.getUserIntent(recentEvents),
      system_state: this.getSystemState(recentEvents),
      metadata: this.getMetadata(),
    };
  }

  /**
   * Subscribe to context events
   */
  subscribe(callback: EventCallback): () => void {
    const id = uuidv4();
    this.subscribers.set(id, callback);
    
    return () => {
      this.subscribers.delete(id);
    };
  }

  /**
   * Get event history
   */
  getEventHistory(limit: number = 50): ContextEvent[] {
    return this.eventQueue.slice(-limit);
  }

  /**
   * Get events by type
   */
  getEventsByType(type: string, limit?: number): ContextEvent[] {
    const events = this.eventQueue.filter(event => event.type === type);
    return limit ? events.slice(-limit) : events;
  }

  /**
   * Clear event history
   */
  clearHistory(): void {
    this.eventQueue = [];
    this.emitEvent('context:cleared', { session_id: this.sessionId });
  }

  /**
   * Get session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }

  /**
   * Reset session (generate new session ID)
   */
  resetSession(): void {
    this.sessionId = this.generateSessionId();
    this.clearHistory();
    this.emitEvent('context:session-reset', { session_id: this.sessionId });
  }

  /**
   * Add event to queue with size management
   */
  private addToQueue(event: ContextEvent): void {
    this.eventQueue.push(event);
    
    // Maintain queue size limit
    if (this.eventQueue.length > this.maxQueueSize) {
      this.eventQueue = this.eventQueue.slice(-this.maxQueueSize);
    }
  }

  /**
   * Notify all subscribers
   */
  private notifySubscribers(event: ContextEvent): void {
    this.subscribers.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in context event subscriber:', error);
      }
    });
  }

  /**
   * Extract current route from recent events
   */
  private getCurrentRoute(events: ContextEvent[]): string {
    const routeEvents = events
      .filter(event => event.type === 'route_change')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return routeEvents[0]?.data?.route || '/';
  }

  /**
   * Extract selected entities from recent events
   */
  private getSelectedEntities(events: ContextEvent[]): string[] {
    const selectionEvents = events
      .filter(event => event.type === 'entity_selection')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return selectionEvents[0]?.data?.entity_ids || [];
  }

  /**
   * Extract user intent from recent events
   */
  private getUserIntent(events: ContextEvent[]): AppContext['user_intent'] {
    const actionEvents = events
      .filter(event => event.type === 'user_action')
      .slice(-10); // Last 10 actions

    const searchEvents = events
      .filter(event => event.type === 'search_query')
      .slice(-5); // Last 5 searches

    return {
      search_query: searchEvents[0]?.data?.query,
      action_type: actionEvents[0]?.data?.action,
      recent_actions: actionEvents.map(event => event.data.action),
    };
  }

  /**
   * Extract system state from recent events
   */
  private getSystemState(events: ContextEvent[]): AppContext['system_state'] {
    const errorEvents = events.filter(event => event.type === 'system_error');
    const recentErrors = errorEvents.filter(event => {
      const eventTime = new Date(event.timestamp).getTime();
      const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
      return eventTime > fiveMinutesAgo;
    });

    return {
      loading: false, // This would come from app state
      error_count: recentErrors.length,
      last_error: recentErrors[0]?.data?.error_message,
    };
  }

  /**
   * Get metadata
   */
  private getMetadata(): AppContext['metadata'] {
    // This would typically come from the app environment
    if (typeof window !== 'undefined' && window.innerWidth && window.innerHeight) {
      return {
        app_version: '1.0.0', // This would come from app config
        screen_size: `${window.innerWidth}x${window.innerHeight}`,
        user_agent: (typeof navigator !== 'undefined' && navigator.userAgent) || 'unknown',
      };
    }

    return {
      app_version: '1.0.0',
      screen_size: 'unknown',
      user_agent: 'server',
    };
  }

  /**
   * Get context statistics
   */
  getStatistics(): {
    total_events: number;
    events_by_type: Record<string, number>;
    session_duration: number;
    last_event_time: string | null;
  } {
    const eventsByType: Record<string, number> = {};
    
    this.eventQueue.forEach(event => {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
    });

    const firstEvent = this.eventQueue[0];
    const sessionDuration = firstEvent 
      ? Date.now() - new Date(firstEvent.timestamp).getTime()
      : 0;

    const lastEvent = this.eventQueue[this.eventQueue.length - 1];

    return {
      total_events: this.eventQueue.length,
      events_by_type: eventsByType,
      session_duration: sessionDuration,
      last_event_time: lastEvent?.timestamp || null,
    };
  }
}

/**
 * Context validation utilities
 */
export class ContextValidator {
  /**
   * Validate context event structure
   */
  static validateEvent(event: ContextEvent): boolean {
    if (!event.type || typeof event.type !== 'string') {
      return false;
    }

    if (!event.timestamp || typeof event.timestamp !== 'string') {
      return false;
    }

    if (!event.session_id || typeof event.session_id !== 'string') {
      return false;
    }

    if (!event.data || typeof event.data !== 'object') {
      return false;
    }

    return true;
  }

  /**
   * Validate app context structure
   */
  static validateAppContext(context: AppContext): boolean {
    const requiredFields = ['current_route', 'selected_entities', 'user_intent', 'system_state', 'metadata'];
    
    for (const field of requiredFields) {
      if (!(field in context)) {
        return false;
      }
    }

    return true;
  }
}

/**
 * Context analytics utilities
 */
export class ContextAnalytics {
  /**
   * Analyze user behavior patterns
   */
  static analyzeUserBehavior(events: ContextEvent[]): {
    most_used_tools: Array<{ tool: string; count: number }>;
    common_actions: Array<{ action: string; count: number }>;
    session_patterns: {
      average_session_duration: number;
      typical_actions_per_session: number;
    };
  } {
    const toolUsage = new Map<string, number>();
    const actionCounts = new Map<string, number>();
    const sessionDurations: number[] = [];
    const actionsPerSession: number[] = [];

    // Analyze events
    events.forEach(event => {
      if (event.type === 'user_action') {
        const action = event.data.action;
        actionCounts.set(action, (actionCounts.get(action) || 0) + 1);
      }
    });

    // Convert to arrays and sort
    const mostUsedTools = Array.from(toolUsage.entries())
      .map(([tool, count]) => ({ tool, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const commonActions = Array.from(actionCounts.entries())
      .map(([action, count]) => ({ action, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      most_used_tools: mostUsedTools,
      common_actions: commonActions,
      session_patterns: {
        average_session_duration: sessionDurations.length > 0 
          ? sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length 
          : 0,
        typical_actions_per_session: actionsPerSession.length > 0
          ? actionsPerSession.reduce((a, b) => a + b, 0) / actionsPerSession.length
          : 0,
      },
    };
  }

  /**
   * Generate context insights
   */
  static generateInsights(context: AppContext, events: ContextEvent[]): string[] {
    const insights: string[] = [];

    // Analyze error patterns
    const errorCount = events.filter(e => e.type === 'system_error').length;
    if (errorCount > 5) {
      insights.push(`High error rate detected: ${errorCount} errors in session`);
    }

    // Analyze search patterns
    const searchEvents = events.filter(e => e.type === 'search_query');
    if (searchEvents.length > 10) {
      insights.push('Active search behavior detected - consider improving search experience');
    }

    // Analyze navigation patterns
    const routeChanges = events.filter(e => e.type === 'route_change');
    if (routeChanges.length > 20) {
      insights.push('High navigation activity - consider optimizing user flow');
    }

    return insights;
  }
}

// Export the ContextEmitter as default
export default ContextEmitter;
