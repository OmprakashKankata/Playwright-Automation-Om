class _NoopBackend {
  info() {}
  error() {}
  debug() {}
  step() {}
}

class Logger {
  static _backend = new _NoopBackend();

  // Replace the logging backend. Backend must implement: info, error, debug, step
  static setBackend(backend) {
    this._backend = backend || new _NoopBackend();
  }

  static getBackend() {
    return this._backend;
  }

  static info(...args) {
    try { this._backend.info(...args); } catch (e) { /* swallow */ }
  }

  static error(...args) {
    try { this._backend.error(...args); } catch (e) { /* swallow */ }
  }

  static debug(...args) {
    try { this._backend.debug(...args); } catch (e) { /* swallow */ }
  }

  static step(...args) {
    try { this._backend.step(...args); } catch (e) { /* swallow */ }
  }
}

// Convenience console backend for local/dev use (not used by default).
function createConsoleBackend({ level = 'info' } = {}) {
  const levels = { error: 0, warn: 1, info: 2, debug: 3 };
  const current = levels[level] ?? 2;
  return {
    info: (...args) => { if (current >= levels.info) console.log('[INFO]', ...args); },
    error: (...args) => { if (current >= levels.error) console.error('[ERROR]', ...args); },
    debug: (...args) => { if (current >= levels.debug) console.debug('[DEBUG]', ...args); },
    step: (...args) => { if (current >= levels.info) console.log('[STEP]', ...args); }
  };
}

// Auto-enable console backend when explicitly requested (useful for local/dev runs)
if (process.env.ENABLE_CONSOLE_LOG === 'true') {
  const level = process.env.LOG_LEVEL || 'info';
  Logger.setBackend(createConsoleBackend({ level }));
}

module.exports = { Logger, createConsoleBackend };
