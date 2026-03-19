/**
 * Autopilot Manager for handling autonomous operations
 */

import { EventEmitter } from 'eventemitter3';
import { v4 as uuidv4 } from 'uuid';
import {
  ToolRequest,
  ToolResponse,
  ContextEvent,
  AppContext,
  AssistantMode,
  AutopilotConfig,
  AutopilotAction,
  AutopilotDecision,
  AutopilotStats
} from '../types';

export { AutopilotConfig } from '../types';

/**
 * Manages autonomous operations and intelligent decision making
 */
export class AutopilotManager extends EventEmitter {
  private config: AutopilotConfig;
  private isEnabled = false;
  private actionHistory: AutopilotAction[] = [];
  private decisionHistory: AutopilotDecision[] = [];
  private currentMode: AssistantMode = 'default';
  private autonomousActionCount = 0;
  private lastContext: AppContext | null = null;

  constructor(config: AutopilotConfig) {
    super();
    this.config = config;
  }

  /**
   * Enable autopilot mode
   */
  async enable(): Promise<void> {
    if (!this.config.enabled) {
      throw new Error('Autopilot is not enabled in configuration');
    }
    
    this.isEnabled = true;
    this.autonomousActionCount = 0;
    this.emit('autopilot:enabled', { timestamp: new Date().toISOString() });
  }

  /**
   * Disable autopilot mode
   */
  async disable(): Promise<void> {
    this.isEnabled = false;
    this.emit('autopilot:disabled', { timestamp: new Date().toISOString() });
  }

  /**
   * Check if autopilot is enabled
   */
  isAutopilotEnabled(): boolean {
    return this.isEnabled;
  }

  /**
   * Set current assistant mode
   */
  setMode(mode: AssistantMode): void {
    const previousMode = this.currentMode;
    this.currentMode = mode;
    
    if (mode === 'autopilot' && !this.isEnabled) {
      this.enable().catch(console.error);
    } else if (mode !== 'autopilot' && this.isEnabled) {
      this.disable().catch(console.error);
    }

    this.emit('autopilot:mode_changed', { 
      previousMode, 
      newMode: mode, 
      timestamp: new Date().toISOString() 
    });
  }

  /**
   * Get current mode
   */
  getMode(): AssistantMode {
    return this.currentMode;
  }

  /**
   * Analyze context and suggest autonomous actions
   */
  async analyzeContext(context: AppContext): Promise<AutopilotAction[]> {
    if (!this.isEnabled || this.currentMode !== 'autopilot') {
      return [];
    }

    this.lastContext = context;
    const suggestedActions: AutopilotAction[] = [];

    // Analyze user intent
    if (context.user_intent.search_query) {
      suggestedActions.push(...this.analyzeSearchIntent(context));
    }

    // Analyze recent actions
    if (context.user_intent.recent_actions.length > 0) {
      suggestedActions.push(...this.analyzeRecentActions(context));
    }

    // Analyze system state
    if (context.system_state.error_count > 0) {
      suggestedActions.push(...this.analyzeSystemErrors(context));
    }

    // Filter and rank actions
    return this.filterAndRankActions(suggestedActions);
  }

  /**
   * Make decision on whether to execute an action autonomously
   */
  async makeDecision(action: AutopilotAction): Promise<AutopilotDecision> {
    const decision: AutopilotDecision = {
      action_id: action.id,
      decision: 'block',
      reason: '',
      confidence: 0,
      timestamp: new Date().toISOString()
    };

    // Check if action is blocked
    if (this.config.blocked_actions.includes(action.tool_name)) {
      decision.reason = 'Action is explicitly blocked in configuration';
      this.decisionHistory.push(decision);
      return decision;
    }

    // Check if action is allowed
    if (!this.config.allowed_actions.includes(action.tool_name)) {
      decision.reason = 'Action is not in allowed actions list';
      this.decisionHistory.push(decision);
      return decision;
    }

    // Check risk threshold
    if (this.isActionTooRisky(action)) {
      decision.decision = 'confirm';
      decision.reason = `Action risk level (${action.risk_level}) exceeds threshold (${this.config.risk_threshold})`;
      this.decisionHistory.push(decision);
      return decision;
    }

    // Check autonomous action limit
    if (this.autonomousActionCount >= this.config.max_autonomous_actions) {
      decision.decision = 'confirm';
      decision.reason = 'Maximum autonomous actions reached';
      this.decisionHistory.push(decision);
      return decision;
    }

    // Check confidence threshold
    const minConfidence = this.getMinimumConfidence(action.risk_level);
    if (action.confidence >= minConfidence) {
      decision.decision = 'execute';
      decision.reason = `High confidence (${action.confidence.toFixed(2)}) for ${action.risk_level} risk action`;
      this.autonomousActionCount++;
    } else {
      decision.decision = 'confirm';
      decision.reason = `Confidence (${action.confidence.toFixed(2)}) below threshold for ${action.risk_level} risk`;
    }

    this.decisionHistory.push(decision);
    this.emit('autopilot:decision_made', decision);
    return decision;
  }

  /**
   * Execute action autonomously
   */
  async executeAction(
    action: AutopilotAction,
    executor: (toolName: string, args: Record<string, any>) => Promise<ToolResponse>
  ): Promise<ToolResponse> {
    try {
      this.emit('autopilot:action_started', action);
      
      const response = await executor(action.tool_name, action.args);
      
      // Update action history with result
      const actionIndex = this.actionHistory.findIndex(a => a.id === action.id);
      if (actionIndex !== -1) {
        this.actionHistory[actionIndex] = {
          ...this.actionHistory[actionIndex],
          result: response
        };
      }

      this.emit('autopilot:action_completed', { action, response });
      
      // Learn from the result if learning is enabled
      if (this.config.learning_enabled) {
        await this.learnFromAction(action, response);
      }

      return response;
    } catch (error) {
      this.emit('autopilot:action_error', { action, error });
      throw error;
    }
  }

  /**
   * Get autopilot statistics
   */
  getStatistics(): AutopilotStats {
    const totalActions = this.actionHistory.length;
    const autoExecuted = this.decisionHistory.filter(d => d.decision === 'execute').length;
    const blocked = this.decisionHistory.filter(d => d.decision === 'block').length;
    const confirmationRequested = this.decisionHistory.filter(d => d.decision === 'confirm').length;
    
    const successRate = totalActions > 0 ? 
      (this.actionHistory.filter(a => a.result?.success).length / totalActions) * 100 : 0;
    
    const averageConfidence = totalActions > 0 ?
      this.actionHistory.reduce((sum, a) => sum + a.confidence, 0) / totalActions : 0;

    return {
      total_actions_analyzed: totalActions,
      auto_executed: autoExecuted,
      blocked,
      confirmation_requested: confirmationRequested,
      success_rate: successRate,
      average_confidence: averageConfidence
    };
  }

  /**
   * Reset autonomous action count (call periodically)
   */
  resetActionCount(): void {
    this.autonomousActionCount = 0;
  }

  /**
   * Get action history
   */
  getActionHistory(): AutopilotAction[] {
    return [...this.actionHistory];
  }

  /**
   * Get decision history
   */
  getDecisionHistory(): AutopilotDecision[] {
    return [...this.decisionHistory];
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.actionHistory = [];
    this.decisionHistory = [];
  }

  // Private helper methods

  private analyzeSearchIntent(context: AppContext): AutopilotAction[] {
    const actions: AutopilotAction[] = [];
    const query = context.user_intent.search_query?.toLowerCase() || '';

    if (query.includes('help') || query.includes('how to')) {
      actions.push(this.createAction('help_assistant', { query }, 0.8, 'low', 'User is asking for help'));
    }

    if (query.includes('create') || query.includes('new')) {
      actions.push(this.createAction('create_item', { type: 'unknown', from_query: query }, 0.7, 'medium', 'User wants to create something'));
    }

    return actions;
  }

  private analyzeRecentActions(context: AppContext): AutopilotAction[] {
    const actions: AutopilotAction[] = [];
    const recent = context.user_intent.recent_actions.slice(-3);

    // Look for patterns
    if (recent.every(action => action.includes('edit'))) {
      actions.push(this.createAction('batch_edit', { items: recent }, 0.6, 'medium', 'Multiple edit actions detected'));
    }

    return actions;
  }

  private analyzeSystemErrors(context: AppContext): AutopilotAction[] {
    const actions: AutopilotAction[] = [];

    if (context.system_state.error_count > 2) {
      actions.push(this.createAction('diagnose_errors', { 
        error_count: context.system_state.error_count,
        last_error: context.system_state.last_error
      }, 0.9, 'low', 'Multiple system errors detected'));
    }

    return actions;
  }

  private filterAndRankActions(actions: AutopilotAction[]): AutopilotAction[] {
    return actions
      .filter(action => !this.config.blocked_actions.includes(action.tool_name))
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 5); // Top 5 suggestions
  }

  private createAction(
    toolName: string,
    args: Record<string, any>,
    confidence: number,
    riskLevel: 'low' | 'medium' | 'high',
    reason: string
  ): AutopilotAction {
    return {
      id: uuidv4(),
      tool_name: toolName,
      args,
      confidence,
      risk_level: riskLevel,
      reason,
      timestamp: new Date().toISOString(),
      context: {}
    };
  }

  private isActionTooRisky(action: AutopilotAction): boolean {
    const riskLevels = { low: 1, medium: 2, high: 3 };
    const actionRisk = riskLevels[action.risk_level];
    const thresholdRisk = riskLevels[this.config.risk_threshold];
    return actionRisk > thresholdRisk;
  }

  private getMinimumConfidence(riskLevel: 'low' | 'medium' | 'high'): number {
    switch (riskLevel) {
      case 'low': return 0.7;
      case 'medium': return 0.85;
      case 'high': return 0.95;
      default: return 0.8;
    }
  }

  private async learnFromAction(action: AutopilotAction, response: ToolResponse): Promise<void> {
    // Simple learning: adjust confidence based on success
    if (response.success) {
      // Boost confidence for successful actions
      const similarActions = this.actionHistory.filter(a => 
        a.tool_name === action.tool_name && a.id !== action.id
      );
      
      similarActions.forEach(similarAction => {
        similarAction.confidence = Math.min(1.0, similarAction.confidence + 0.05);
      });
    } else {
      // Reduce confidence for failed actions
      const similarActions = this.actionHistory.filter(a => 
        a.tool_name === action.tool_name && a.id !== action.id
      );
      
      similarActions.forEach(similarAction => {
        similarAction.confidence = Math.max(0.1, similarAction.confidence - 0.1);
      });
    }

    this.emit('autopilot:learning_update', { action, response });
  }
}
