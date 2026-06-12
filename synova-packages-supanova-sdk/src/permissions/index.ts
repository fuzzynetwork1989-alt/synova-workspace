/**
 * Permission Management and Security
 */

import { EventEmitter } from 'eventemitter3';
import {
  ToolPermission,
  PermissionCheckResult,
  PermissionManager as IPermissionManager,
  ToolRequest,
  ValidationResult,
  ValidationError
} from '../types';

export class PermissionManager extends EventEmitter implements IPermissionManager {
  private permissions: Map<string, ToolPermission> = new Map();
  private roleHierarchy: Map<string, number> = new Map();
  private auditLog: Array<{
    timestamp: string;
    tool: string;
    user_id: string;
    role: string;
    allowed: boolean;
    reason?: string;
  }> = [];

  constructor() {
    super();
    this.setupDefaultRoleHierarchy();
  }

  /**
   * Setup default role hierarchy (higher number = higher privilege)
   */
  private setupDefaultRoleHierarchy(): void {
    this.roleHierarchy.set('viewer', 1);
    this.roleHierarchy.set('editor', 2);
    this.roleHierarchy.set('owner', 3);
    this.roleHierarchy.set('admin', 4);
  }

  /**
   * Check if a user has permission to execute a tool
   */
  async checkPermission(toolName: string, actor: ToolRequest['actor']): Promise<PermissionCheckResult> {
    const startTime = Date.now();
    
    try {
      // Get tool permissions
      const permission = this.getPermissions(toolName);
      if (!permission) {
        const result = {
          allowed: false,
          reason: `Tool '${toolName}' has no permissions configured`,
        };
        this.logAuditEntry(toolName, actor, result);
        return result;
      }

      // Check role-based access
      const roleCheck = this.checkRolePermission(permission, actor.role);
      if (!roleCheck.allowed) {
        const result = roleCheck;
        this.logAuditEntry(toolName, actor, result);
        return result;
      }

      // Check rate limits
      const rateLimitCheck = await this.checkRateLimit(permission, actor);
      if (!rateLimitCheck.allowed) {
        const result = rateLimitCheck;
        this.logAuditEntry(toolName, actor, result);
        return result;
      }

      // Check data access permissions
      const dataAccessCheck = this.checkDataAccess(permission, actor);
      if (!dataAccessCheck.allowed) {
        const result = dataAccessCheck;
        this.logAuditEntry(toolName, actor, result);
        return result;
      }

      // Success
      const result = {
        allowed: true,
        requires_confirmation: permission.requires_confirmation,
        rate_limit_remaining: rateLimitCheck.rate_limit_remaining,
      };

      this.logAuditEntry(toolName, actor, result);
      this.emit('permission:checked', { toolName, actor, result, duration: Date.now() - startTime });
      
      return result;

    } catch (error) {
      const result = {
        allowed: false,
        reason: `Permission check failed: ${(error as Error).message}`,
      };
      
      this.logAuditEntry(toolName, actor, result);
      this.emit('permission:error', { toolName, actor, error, duration: Date.now() - startTime });
      
      return result;
    }
  }

  /**
   * Update permissions for a tool
   */
  updatePermissions(toolName: string, permissions: ToolPermission): void {
    // Validate permissions
    const validation = this.validatePermissionStructure(permissions);
    if (!validation.valid) {
      throw new Error(`Invalid permissions: ${validation.errors.map((e: ValidationError) => e.message).join(', ')}`);
    }

    this.permissions.set(toolName, permissions);
    this.emit('permission:updated', { toolName, permissions });
  }

  /**
   * Get permissions for a tool
   */
  getPermissions(toolName: string): ToolPermission | undefined {
    return this.permissions.get(toolName);
  }

  /**
   * Get all permissions
   */
  getAllPermissions(): Record<string, ToolPermission> {
    return Object.fromEntries(this.permissions);
  }

  /**
   * Remove permissions for a tool
   */
  removePermissions(toolName: string): boolean {
    const removed = this.permissions.delete(toolName);
    if (removed) {
      this.emit('permission:removed', { toolName });
    }
    return removed;
  }

  /**
   * Validate all permissions
   */
  validatePermissions(): boolean {
    let allValid = true;

    for (const [toolName, permissions] of this.permissions) {
      const validation = this.validatePermissionStructure(permissions);
      if (!validation.valid) {
        console.error(`Invalid permissions for tool '${toolName}':`, validation.errors);
        allValid = false;
      }
    }

    return allValid;
  }

  /**
   * Check role-based permissions
   */
  private checkRolePermission(permission: ToolPermission, userRole: string): PermissionCheckResult {
    // Check if user's role is in allowed roles
    if (!permission.allowed_roles.includes(userRole)) {
      return {
        allowed: false,
        reason: `Role '${userRole}' is not allowed. Required roles: ${permission.allowed_roles.join(', ')}`,
      };
    }

    return { allowed: true };
  }

  /**
   * Check rate limits
   */
  private async checkRateLimit(permission: ToolPermission, actor: ToolRequest['actor']): Promise<PermissionCheckResult> {
    // This would typically integrate with a rate limiting service
    // For now, we'll return a mock implementation
    const key = `${actor.user_id}:${actor.role}`;
    const currentUsage = await this.getCurrentUsage(key);
    const limit = permission.rate_limit.requests_per_minute;

    if (currentUsage >= limit) {
      return {
        allowed: false,
        reason: 'Rate limit exceeded',
        rate_limit_remaining: 0,
      };
    }

    return {
      allowed: true,
      rate_limit_remaining: limit - currentUsage,
    };
  }

  /**
   * Check data access permissions
   */
  private checkDataAccess(permission: ToolPermission, actor: ToolRequest['actor']): PermissionCheckResult {
    // This would typically check specific data access rules
    // For now, we'll do a basic check based on data access level and role
    
    if (permission.data_access === 'none') {
      return { allowed: true }; // No data access is always allowed
    }

    if (permission.data_access === 'full_access' && actor.role !== 'admin') {
      return {
        allowed: false,
        reason: 'Full data access requires admin role',
      };
    }

    return { allowed: true };
  }

  /**
   * Get current usage for rate limiting (mock implementation)
   */
  private async getCurrentUsage(key: string): Promise<number> {
    // This would typically query a rate limiting service or database
    // For now, return a random value for demonstration
    return Math.floor(Math.random() * 10);
  }

  /**
   * Validate permission structure
   */
  private validatePermissionStructure(permission: ToolPermission): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // Check required fields
    if (!Array.isArray(permission.allowed_roles) || permission.allowed_roles.length === 0) {
      errors.push({
        field: 'allowed_roles',
        message: 'allowed_roles must be a non-empty array',
        code: 'REQUIRED_FIELD',
      });
    }

    if (!permission.rate_limit || typeof permission.rate_limit !== 'object') {
      errors.push({
        field: 'rate_limit',
        message: 'rate_limit is required and must be an object',
        code: 'REQUIRED_FIELD',
      });
    } else {
      if (typeof permission.rate_limit.requests_per_minute !== 'number' || permission.rate_limit.requests_per_minute <= 0) {
        errors.push({
          field: 'rate_limit.requests_per_minute',
          message: 'requests_per_minute must be a positive number',
          code: 'INVALID_VALUE',
        });
      }

      if (typeof permission.rate_limit.burst !== 'number' || permission.rate_limit.burst <= 0) {
        errors.push({
          field: 'rate_limit.burst',
          message: 'burst must be a positive number',
          code: 'INVALID_VALUE',
        });
      }
    }

    if (!['none', 'read_only', 'limited_write', 'full_access'].includes(permission.data_access)) {
      errors.push({
        field: 'data_access',
        message: 'data_access must be one of: none, read_only, limited_write, full_access',
        code: 'INVALID_VALUE',
      });
    }

    // Warnings
    if (permission.data_access === 'full_access') {
      warnings.push({
        field: 'data_access',
        message: 'Full data access should be restricted to admin roles only',
        code: 'SECURITY_WARNING',
      });
    }

    if (permission.rate_limit.requests_per_minute > 1000) {
      warnings.push({
        field: 'rate_limit.requests_per_minute',
        message: 'High rate limit may impact performance',
        code: 'PERFORMANCE_WARNING',
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Log audit entry
   */
  private logAuditEntry(toolName: string, actor: ToolRequest['actor'], result: PermissionCheckResult): void {
    const entry = {
      timestamp: new Date().toISOString(),
      tool: toolName,
      user_id: actor.user_id,
      role: actor.role,
      allowed: result.allowed,
      reason: result.reason,
    };

    this.auditLog.push(entry);

    // Maintain audit log size
    if (this.auditLog.length > 10000) {
      this.auditLog = this.auditLog.slice(-5000);
    }

    this.emit('permission:audited', entry);
  }

  /**
   * Get audit log
   */
  getAuditLog(limit?: number): Array<{
    timestamp: string;
    tool: string;
    user_id: string;
    role: string;
    allowed: boolean;
    reason?: string;
  }> {
    return limit ? this.auditLog.slice(-limit) : this.auditLog;
  }

  /**
   * Clear audit log
   */
  clearAuditLog(): void {
    this.auditLog = [];
    this.emit('audit:cleared');
  }

  /**
   * Get permission statistics
   */
  getStatistics(): {
    total_tools: number;
    permission_checks: number;
    allowed_checks: number;
    denied_checks: number;
    most_denied_tools: Array<{ tool: string; denials: number }>;
    role_usage: Record<string, number>;
  } {
    const deniedCounts = new Map<string, number>();
    const roleUsage: Record<string, number> = {};

    for (const entry of this.auditLog) {
      if (!entry.allowed) {
        deniedCounts.set(entry.tool, (deniedCounts.get(entry.tool) || 0) + 1);
      }
      
      roleUsage[entry.role] = (roleUsage[entry.role] || 0) + 1;
    }

    const mostDeniedTools = Array.from(deniedCounts.entries())
      .map(([tool, denials]) => ({ tool, denials }))
      .sort((a, b) => b.denials - a.denials)
      .slice(0, 10);

    const allowedChecks = this.auditLog.filter(entry => entry.allowed).length;
    const deniedChecks = this.auditLog.filter(entry => !entry.allowed).length;

    return {
      total_tools: this.permissions.size,
      permission_checks: this.auditLog.length,
      allowed_checks: allowedChecks,
      denied_checks: deniedChecks,
      most_denied_tools: mostDeniedTools,
      role_usage: roleUsage,
    };
  }

  /**
   * Set role hierarchy
   */
  setRoleHierarchy(hierarchy: Record<string, number>): void {
    this.roleHierarchy = new Map(Object.entries(hierarchy));
    this.emit('role-hierarchy:updated', hierarchy);
  }

  /**
   * Get role hierarchy
   */
  getRoleHierarchy(): Record<string, number> {
    return Object.fromEntries(this.roleHierarchy);
  }

  /**
   * Check if role has sufficient privilege level
   */
  hasRolePrivilege(userRole: string, requiredRole: string): boolean {
    const userLevel = this.roleHierarchy.get(userRole) || 0;
    const requiredLevel = this.roleHierarchy.get(requiredRole) || 0;
    
    return userLevel >= requiredLevel;
  }
}

/**
 * Permission presets for common use cases
 */
export const PermissionPresets = {
  /**
   * Read-only tool permissions
   */
  readOnly: (allowedRoles: string[] = ['viewer', 'editor', 'owner']): ToolPermission => ({
    requires_confirmation: false,
    allowed_roles: allowedRoles,
    rate_limit: {
      requests_per_minute: 60,
      burst: 10,
    },
    data_access: 'read_only',
  }),

  /**
   * Safe write tool permissions
   */
  safeWrite: (allowedRoles: string[] = ['editor', 'owner']): ToolPermission => ({
    requires_confirmation: false,
    allowed_roles: allowedRoles,
    rate_limit: {
      requests_per_minute: 30,
      burst: 5,
    },
    data_access: 'limited_write',
  }),

  /**
   * Destructive action permissions
   */
  destructive: (allowedRoles: string[] = ['owner']): ToolPermission => ({
    requires_confirmation: true,
    allowed_roles: allowedRoles,
    rate_limit: {
      requests_per_minute: 10,
      burst: 2,
    },
    data_access: 'limited_write',
    destructive_actions: {
      delete: 'confirmation_required',
      bulk_update: 'confirmation_required',
      sensitive_fields: 'confirmation_required',
    },
  }),

  /**
   * Admin-only permissions
   */
  adminOnly: (): ToolPermission => ({
    requires_confirmation: true,
    allowed_roles: ['admin'],
    rate_limit: {
      requests_per_minute: 20,
      burst: 3,
    },
    data_access: 'full_access',
  }),

  /**
   * Public tool permissions (no authentication required)
   */
  public: (): ToolPermission => ({
    requires_confirmation: false,
    allowed_roles: ['viewer', 'editor', 'owner', 'admin'],
    rate_limit: {
      requests_per_minute: 100,
      burst: 20,
    },
    data_access: 'read_only',
  }),
};

/**
 * Security utilities
 */
export class SecurityUtils {
  /**
   * Validate input for security threats
   */
  static validateInput(input: any): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    if (typeof input === 'string') {
      // Check for potential XSS
      if (/<script|javascript:|on\w+=/i.test(input)) {
        errors.push({
          field: 'input',
          message: 'Potentially dangerous script content detected',
          code: 'SECURITY_THREAT',
        });
      }

      // Check for SQL injection patterns
      const sqlPattern = /[';]|(--)|(\b(ALTER|CREATE|DELETE|DROP|EXEC|INSERT|MERGE|SELECT|UPDATE|UNION)\b)/i;
      if (sqlPattern.test(input)) {
        errors.push({
          field: 'input',
          message: 'Potential SQL injection pattern detected',
          code: 'SECURITY_THREAT',
        });
      }

      // Check for path traversal
      if (/\.\.[\/\\]/.test(input)) {
        errors.push({
          field: 'input',
          message: 'Path traversal pattern detected',
          code: 'SECURITY_THREAT',
        });
      }

      // Check for extremely long input
      if (input.length > 100000) {
        warnings.push({
          field: 'input',
          message: 'Very long input may impact performance',
          code: 'PERFORMANCE_WARNING',
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Sanitize output for safe display
   */
  static sanitizeOutput(output: any): any {
    if (typeof output === 'string') {
      // Basic HTML escaping
      return output
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
    }

    if (typeof output === 'object' && output !== null) {
      // Recursively sanitize object properties
      const sanitized: any = Array.isArray(output) ? [] : {};
      
      for (const [key, value] of Object.entries(output)) {
        sanitized[key] = this.sanitizeOutput(value);
      }
      
      return sanitized;
    }

    return output;
  }

  /**
   * Generate secure random token
   */
  static generateToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return result;
  }

  /**
   * Hash sensitive data
   */
  static hash(data: string): string {
    // Simple hash function for demonstration
    // In production, use a proper cryptographic hash
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }
}

// Export the PermissionManager as default
export default PermissionManager;
