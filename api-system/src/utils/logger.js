/**
 * Simple logger utility
 * Provides consistent logging across the application
 */

export class Logger {
  constructor(level = 'info') {
    this.level = level;
  }

  log(message, level = 'info') {
    const timestamp = new Date().toISOString();
    const logLevel = this.getLogLevel(level);
    
    if (this.shouldLog(level)) {
      console.log(`[${timestamp}] [${logLevel.toUpperCase()}] ${message}`);
    }
  }

  info(message) {
    this.log(message, 'info');
  }

  warn(message) {
    this.log(message, 'warn');
  }

  error(message) {
    this.log(message, 'error');
  }

  debug(message) {
    this.log(message, 'debug');
  }

  getLogLevel(level) {
    const levels = {
      'error': 0,
      'warn': 1,
      'info': 2,
      'debug': 3
    };
    return levels[level] || 2;
  }

  shouldLog(level) {
    return this.getLogLevel(level) <= this.getLogLevel(this.level);
  }
}

export default new Logger(process.env.LOG_LEVEL || 'info');
