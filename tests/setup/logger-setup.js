// This file is executed as Playwright `globalSetup` and sets an env var
// to enable local console logging for test worker processes.

module.exports = async () => {
  // Enable console logging for local/dev runs when not on CI.
  if (!process.env.CI && process.env.NODE_ENV !== 'production') {
    process.env.ENABLE_CONSOLE_LOG = 'true';
    // Optionally set a log level for local debugging
    process.env.LOG_LEVEL = process.env.LOG_LEVEL || 'info';
  }
};
