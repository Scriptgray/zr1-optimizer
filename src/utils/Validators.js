export class Validators {
    static isFunction(fn) {
        return typeof fn === 'function';
    }

    static isAsyncFunction(fn) {
        return typeof fn === 'function' && fn.constructor.name === 'AsyncFunction';
    }

    static isValidTTL(ttl) {
        return typeof ttl === 'number' && ttl > 0 && ttl <= 86400000;
    }

    static isSafeCacheKey(key) {
        return typeof key === 'string' && key.length > 0 && key.length < 256;
    }

    static validateConfig(config) {
        const errors = [];
        
        if (config.memoryLimit && (config.memoryLimit < 0 || config.memoryLimit > 1)) {
            errors.push('memoryLimit must be between 0 and 1');
        }
        
        if (config.concurrencyLimit && (config.concurrencyLimit < 1 || config.concurrencyLimit > 100)) {
            errors.push('concurrencyLimit must be between 1 and 100');
        }
        
        return errors;
    }
}