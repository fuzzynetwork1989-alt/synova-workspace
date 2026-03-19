import { EventEmitter } from 'eventemitter3';
import { s as PermissionManager$1, h as ToolRequest, P as PermissionCheckResult, i as ToolPermission, o as ValidationResult } from './index-98edcafd.js';

/**
 * Permission Management and Security
 */

declare class PermissionManager extends EventEmitter implements PermissionManager$1 {
    private permissions;
    private roleHierarchy;
    private auditLog;
    constructor();
    /**
     * Setup default role hierarchy (higher number = higher privilege)
     */
    private setupDefaultRoleHierarchy;
    /**
     * Check if a user has permission to execute a tool
     */
    checkPermission(toolName: string, actor: ToolRequest['actor']): Promise<PermissionCheckResult>;
    /**
     * Update permissions for a tool
     */
    updatePermissions(toolName: string, permissions: ToolPermission): void;
    /**
     * Get permissions for a tool
     */
    getPermissions(toolName: string): ToolPermission | undefined;
    /**
     * Get all permissions
     */
    getAllPermissions(): Record<string, ToolPermission>;
    /**
     * Remove permissions for a tool
     */
    removePermissions(toolName: string): boolean;
    /**
     * Validate all permissions
     */
    validatePermissions(): boolean;
    /**
     * Check role-based permissions
     */
    private checkRolePermission;
    /**
     * Check rate limits
     */
    private checkRateLimit;
    /**
     * Check data access permissions
     */
    private checkDataAccess;
    /**
     * Get current usage for rate limiting (mock implementation)
     */
    private getCurrentUsage;
    /**
     * Validate permission structure
     */
    private validatePermissionStructure;
    /**
     * Log audit entry
     */
    private logAuditEntry;
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
    }>;
    /**
     * Clear audit log
     */
    clearAuditLog(): void;
    /**
     * Get permission statistics
     */
    getStatistics(): {
        total_tools: number;
        permission_checks: number;
        allowed_checks: number;
        denied_checks: number;
        most_denied_tools: Array<{
            tool: string;
            denials: number;
        }>;
        role_usage: Record<string, number>;
    };
    /**
     * Set role hierarchy
     */
    setRoleHierarchy(hierarchy: Record<string, number>): void;
    /**
     * Get role hierarchy
     */
    getRoleHierarchy(): Record<string, number>;
    /**
     * Check if role has sufficient privilege level
     */
    hasRolePrivilege(userRole: string, requiredRole: string): boolean;
}
/**
 * Permission presets for common use cases
 */
declare const PermissionPresets: {
    /**
     * Read-only tool permissions
     */
    readOnly: (allowedRoles?: string[]) => ToolPermission;
    /**
     * Safe write tool permissions
     */
    safeWrite: (allowedRoles?: string[]) => ToolPermission;
    /**
     * Destructive action permissions
     */
    destructive: (allowedRoles?: string[]) => ToolPermission;
    /**
     * Admin-only permissions
     */
    adminOnly: () => ToolPermission;
    /**
     * Public tool permissions (no authentication required)
     */
    public: () => ToolPermission;
};
/**
 * Security utilities
 */
declare class SecurityUtils {
    /**
     * Validate input for security threats
     */
    static validateInput(input: any): ValidationResult;
    /**
     * Sanitize output for safe display
     */
    static sanitizeOutput(output: any): any;
    /**
     * Generate secure random token
     */
    static generateToken(length?: number): string;
    /**
     * Hash sensitive data
     */
    static hash(data: string): string;
}

export { PermissionManager, PermissionPresets, SecurityUtils, PermissionManager as default };
