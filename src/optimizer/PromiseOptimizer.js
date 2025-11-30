export class PromiseOptimizer {
    constructor(cacheManager, metrics) {
        this.cacheManager = cacheManager;
        this.metrics = metrics;
        this.originalThen = Promise.prototype.then;
    }

    enable() {
        const self = this;
        
        Promise.prototype.then = function(onFulfilled, onRejected) {
            self.metrics.recordOperation();
            
            if (typeof onFulfilled === 'function') {
                const optimizedOnFulfilled = function(...args) {
                    const cacheKey = self.generateCacheKey(onFulfilled, args);
                    
                    const cached = self.cacheManager.get(cacheKey);
                    if (cached !== undefined) {
                        return cached;
                    }
                    
                    const result = onFulfilled.apply(this, args);
                    
                    if (result && typeof result.then === 'function') {
                        self.cacheManager.set(cacheKey, result);
                    }
                    
                    return result;
                };
                
                return self.originalThen.call(this, optimizedOnFulfilled, onRejected);
            }
            
            return self.originalThen.call(this, onFulfilled, onRejected);
        };
    }

    disable() {
        Promise.prototype.then = this.originalThen;
    }

    generateCacheKey(fn, args) {
        try {
            const argsString = JSON.stringify(args);
            return `promise:${fn.name || 'anonymous'}:${argsString}`;
        } catch {
            return `promise:${fn.name || 'anonymous'}:${args.length}`;
        }
    }
}