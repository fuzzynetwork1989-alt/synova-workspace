import logger from '../utils/logger.js';

/**
 * Global error handling middleware
 * Centralized error handling for the API
 */

export class ErrorHandler {
  /**
   * Handle async errors
   */
  static asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  /**
   * Main error handler
   */
  static handle(error, req, res, next) {
    logger.error(`Error: ${error.message}`);
    logger.error(`Stack: ${error.stack}`);

    // Don't expose stack trace in production
    const isDevelopment = process.env.NODE_ENV !== 'production';

    // Handle specific error types
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        errors: error.errors,
        timestamp: new Date().toISOString()
      });
    }

    if (error.name === 'UnauthorizedError') {
      return res.status(401).json({
        success: false,
        error: error.message || 'Unauthorized',
        timestamp: new Date().toISOString()
      });
    }

    if (error.name === 'ForbiddenError') {
      return res.status(403).json({
        success: false,
        error: error.message || 'Access denied',
        timestamp: new Date().toISOString()
      });
    }

    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        success: false,
        error: error.message || 'Resource not found',
        timestamp: new Date().toISOString()
      });
    }

    if (error.name === 'RateLimitError') {
      return res.status(429).json({
        success: false,
        error: error.message || 'Rate limit exceeded',
        retryAfter: error.retryAfter || 60,
        timestamp: new Date().toISOString()
      });
    }

    // Default error response
    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Internal server error',
      ...(isDevelopment && { stack: error.stack }),
      timestamp: new Date().toISOString()
    });
  }

  /**
   * 404 handler
   */
  static notFound(req, res) {
    res.status(404).json({
      success: false,
      error: `Route ${req.method} ${req.path} not found`,
      availableEndpoints: [
        'GET /',
        'GET /health',
        'POST /api/v1/keys',
        'GET /api/v1/keys',
        'GET /api/v1/keys/:keyId',
        'PATCH /api/v1/keys/:keyId',
        'DELETE /api/v1/keys/:keyId',
        'POST /api/v1/auth/validate',
        'GET /api/v1/analytics',
        'POST /api/v1/keys/batch'
      ],
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Custom error classes
   */
  static ValidationError(message, errors = []) {
    const error = new Error(message);
    error.name = 'ValidationError';
    error.errors = errors;
    return error;
  }

  static UnauthorizedError(message) {
    const error = new Error(message);
    error.name = 'UnauthorizedError';
    return error;
  }

  static ForbiddenError(message) {
    const error = new Error(message);
    error.name = 'ForbiddenError';
    return error;
  }

  static NotFoundError(message) {
    const error = new Error(message);
    error.name = 'NotFoundError';
    return error;
  }

  static RateLimitError(message, retryAfter = 60) {
    const error = new Error(message);
    error.name = 'RateLimitError';
    error.retryAfter = retryAfter;
    return error;
  }
}
