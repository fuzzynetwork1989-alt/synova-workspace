import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

/**
 * Cryptographically secure API key generator
 * Similar to OpenAI/Anthropic key format
 */
export class KeyGenerator {
  /**
   * Generate a new API key with prefix
   * Format: sk-{random_string}
   */
  static generateApiKey(prefix = 'sk') {
    const timestamp = Date.now().toString(36);
    const randomBytes = crypto.randomBytes(32).toString('hex');
    const key = `${prefix}_${timestamp}_${randomBytes}`;
    
    return {
      key,
      keyId: uuidv4(),
      prefix,
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Generate JWT token for API key
   */
  static generateJWT(keyId, secret, expiresIn = '1h') {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const payload = {
      keyId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + this.parseExpiration(expiresIn)
    };

    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    
    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  /**
   * Validate JWT token
   */
  static validateJWT(token, secret) {
    try {
      const [header, payload, signature] = token.split('.');
      
      const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${header}.${payload}`)
        .digest('base64url');

      if (signature !== expectedSignature) {
        return { valid: false, error: 'Invalid signature' };
      }

      const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString());
      
      if (decodedPayload.exp < Math.floor(Date.now() / 1000)) {
        return { valid: false, error: 'Token expired' };
      }

      return { valid: true, payload: decodedPayload };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  /**
   * Hash API key for storage
   */
  static hashApiKey(apiKey) {
    return crypto.createHash('sha256').update(apiKey).digest('hex');
  }

  /**
   * Verify API key against hash
   */
  static verifyApiKey(apiKey, hashedKey) {
    const hash = this.hashApiKey(apiKey);
    return hash === hashedKey;
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken() {
    return crypto.randomBytes(64).toString('hex');
  }

  /**
   * Parse expiration time
   */
  static parseExpiration(expiresIn) {
    const units = {
      's': 1,
      'm': 60,
      'h': 3600,
      'd': 86400,
      'w': 604800
    };

    const match = expiresIn.match(/^(\d+)([smhdw])$/);
    if (!match) return 3600; // Default 1 hour

    const [, amount, unit] = match;
    return parseInt(amount) * (units[unit] || 3600);
  }

  /**
   * Generate multiple keys for testing
   */
  static generateBatch(count = 10, prefix = 'sk') {
    const keys = [];
    for (let i = 0; i < count; i++) {
      keys.push(this.generateApiKey(prefix));
    }
    return keys;
  }

  /**
   * Check key format validity
   */
  static isValidKeyFormat(key) {
    const pattern = /^[a-z]{2}_[a-z0-9]+_[a-f0-9]{64}$/;
    return pattern.test(key);
  }

  /**
   * Extract key metadata
   */
  static extractKeyMetadata(key) {
    if (!this.isValidKeyFormat(key)) {
      throw new Error('Invalid key format');
    }

    const [prefix, timestamp, hash] = key.split('_');
    const createdAt = new Date(parseInt(timestamp, 36));
    
    return {
      prefix,
      timestamp,
      hash,
      createdAt,
      age: Date.now() - createdAt.getTime()
    };
  }
}
