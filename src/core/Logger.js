export class Logger {
    constructor() {
        this.levels = { ERROR: 0, WARN: 1, INFO: 2, DEBUG: 3 };
        this.currentLevel = this.levels.INFO;
    }

    setLevel(level) {
        this.currentLevel = this.levels[level] || this.levels.INFO;
    }

    error(message, ...args) {
        if (this.currentLevel >= this.levels.ERROR) {
            console.error(`❌ [${new Date().toISOString()}] ERROR: ${message}`, ...args);
        }
    }

    warn(message, ...args) {
        if (this.currentLevel >= this.levels.WARN) {
            console.warn(`⚠️ [${new Date().toISOString()}] WARN: ${message}`, ...args);
        }
    }

    info(message, ...args) {
        if (this.currentLevel >= this.levels.INFO) {
            console.log(`ℹ️ [${new Date().toISOString()}] INFO: ${message}`, ...args);
        }
    }

    debug(message, ...args) {
        if (this.currentLevel >= this.levels.DEBUG) {
            console.debug(`🐛 [${new Date().toISOString()}] DEBUG: ${message}`, ...args);
        }
    }

    performance(operation, duration) {
        if (duration > 100) {
            this.warn(`Slow operation detected: ${operation} - ${duration}ms`);
        }
    }
}

export const logger = new Logger();