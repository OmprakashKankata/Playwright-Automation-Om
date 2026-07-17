class Logger {
  static info(message) {
    console.log(`[INFO] ${message}`);
  }

  static error(message) {
    console.error(`[ERROR] ${message}`);
  }

  static step(stepNumber, message) {
    console.log(`\n[Step ${stepNumber}] ${message}`);
  }

  static debug(message) {
    if (process.env.DEBUG === 'true') {
      console.log(`[DEBUG] ${message}`);
    }
  }
}

module.exports = { Logger };
