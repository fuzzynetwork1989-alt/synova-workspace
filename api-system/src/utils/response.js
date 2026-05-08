/**
 * Response utilities
 * Standardized API response formatting
 */

export class ResponseHelper {
  /**
   * Success response
   */
  static success(data = null, message = 'Success', statusCode = 200) {
    return {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Error response
   */
  static error(message = 'Internal server error', statusCode = 500, errors = null) {
    return {
      success: false,
      error: message,
      errors,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Validation error response
   */
  static validationError(errors) {
    return this.error('Validation failed', 400, errors);
  }

  /**
   * Not found response
   */
  static notFound(resource = 'Resource') {
    return this.error(`${resource} not found`, 404);
  }

  /**
   * Unauthorized response
   */
  static unauthorized(message = 'Unauthorized') {
    return this.error(message, 401);
  }

  /**
   * Forbidden response
   */
  static forbidden(message = 'Access denied') {
    return this.error(message, 403);
  }

  /**
   * Rate limited response
   */
  static rateLimited(resetTime) {
    return this.error(
      'Rate limit exceeded. Please try again later.',
      429,
      { resetTime }
    );
  }

  /**
   * Paginated response
   */
  static paginated(data, pagination = {}) {
    return {
      success: true,
      data,
      pagination: {
        page: pagination.page || 1,
        limit: pagination.limit || 50,
        total: pagination.total || 0,
        pages: Math.ceil((pagination.total || 0) / (pagination.limit || 50)),
        ...pagination
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Created response
   */
  static created(data, message = 'Created successfully') {
    return this.success(data, message, 201);
  }

  /**
   * Updated response
   */
  static updated(data, message = 'Updated successfully') {
    return this.success(data, message, 200);
  }

  /**
   * Deleted response
   */
  static deleted(message = 'Deleted successfully') {
    return this.success(null, message, 200);
  }
}
