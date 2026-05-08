/**
 * Validation utilities
 * Common validation functions for API requests
 */

export class Validator {
  /**
   * Validate email format
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate API key format
   */
  static isValidApiKey(key) {
    if (!key || typeof key !== 'string') {
      return false;
    }
    
    // Format: prefix_timestamp_hash
    const keyPattern = /^[a-z]{2}_[a-z0-9]+_[a-f0-9]{64}$/;
    return keyPattern.test(key);
  }

  /**
   * Validate UUID format
   */
  static isValidUUID(uuid) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Validate permissions array
   */
  static isValidPermissions(permissions) {
    if (!Array.isArray(permissions)) {
      return false;
    }

    const validPermissions = ['read', 'write', 'admin', 'delete', 'update'];
    return permissions.every(perm => validPermissions.includes(perm));
  }

  /**
   * Validate rate limit
   */
  static isValidRateLimit(rateLimit) {
    const num = parseInt(rateLimit);
    return !isNaN(num) && num > 0 && num <= 100000;
  }

  /**
   * Validate name
   */
  static isValidName(name) {
    if (!name || typeof name !== 'string') {
      return false;
    }
    
    return name.length >= 1 && name.length <= 100 && /^[a-zA-Z0-9\s_-]+$/.test(name);
  }

  /**
   * Validate expiration time
   */
  static isValidExpiration(expiresIn) {
    if (!expiresIn) return true; // null means never expires
    
    const timePattern = /^\d+[smhdw]$/;
    return timePattern.test(expiresIn);
  }

  /**
   * Sanitize input
   */
  static sanitize(input) {
    if (typeof input !== 'string') {
      return input;
    }
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML
      .replace(/javascript:/gi, '') // Remove potential XSS
      .substring(0, 1000); // Limit length
  }

  /**
   * Validate pagination parameters
   */
  static isValidPagination(limit, offset) {
    const limitNum = parseInt(limit);
    const offsetNum = parseInt(offset);
    
    return (
      (!isNaN(limitNum) && limitNum > 0 && limitNum <= 100) &&
      (!isNaN(offsetNum) && offsetNum >= 0)
    );
  }

  /**
   * Validate API request body
   */
  static validateApiKeyRequest(body) {
    const errors = [];
    const { name, permissions, rateLimit, expiresIn } = body;

    if (!this.isValidName(name)) {
      errors.push('Name is required and must be 1-100 characters');
    }

    if (permissions && !this.isValidPermissions(permissions)) {
      errors.push('Permissions must be an array of valid permissions');
    }

    if (rateLimit && !this.isValidRateLimit(rateLimit)) {
      errors.push('Rate limit must be between 1 and 100000');
    }

    if (expiresIn && !this.isValidExpiration(expiresIn)) {
      errors.push('Expiration must be in format like "24h", "7d", etc.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate user data
   */
  static validateUserData(userData) {
    const errors = [];
    const { email, name, password } = userData;

    if (!this.isValidEmail(email)) {
      errors.push('Valid email is required');
    }

    if (!this.isValidName(name)) {
      errors.push('Name is required and must be 1-100 characters');
    }

    if (!password || password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
