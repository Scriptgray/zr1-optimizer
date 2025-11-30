import QuickLRU from 'quick-lru';

export class SpeedBooster {
    constructor() {
        this.operationCache = new QuickLRU({ maxSize: 1000, maxAge: 30000 });
        this.functionCache = new QuickLRU({ maxSize: 500, maxAge: 60000 });
        this.stats = {
            cacheHits: 0,
            cacheMisses: 0,
            optimizedCalls: 0,
            timeSaved: 0
        };
    }

    turboFunction(fn, cacheKey = null, ttl = 30000) {
        const optimizedFn = async (...args) => {
            this.stats.optimizedCalls++;
            const startTime = Date.now();
            
            const key = cacheKey || `func:${fn.name}:${JSON.stringify(args)}`;
            
            if (this.functionCache.has(key)) {
                this.stats.cacheHits++;
                this.stats.timeSaved += Date.now() - startTime;
                return this.functionCache.get(key);
            }
            
            this.stats.cacheMisses++;
            const result = await fn(...args);
            this.functionCache.set(key, result, { maxAge: ttl });
            return result;
        };
        
        return optimizedFn;
    }

    turboOperation(operationId, operationFn, ttl = 45000) {
        const startTime = Date.now();
        
        if (this.operationCache.has(operationId)) {
            this.stats.cacheHits++;
            this.stats.timeSaved += Date.now() - startTime;
            return this.operationCache.get(operationId);
        }
        
        this.stats.cacheMisses++;
        const result = operationFn();
        
        if (result && typeof result.then === 'function') {
            return result.then(finalResult => {
                this.operationCache.set(operationId, finalResult, { maxAge: ttl });
                return finalResult;
            });
        } else {
            this.operationCache.set(operationId, result, { maxAge: ttl });
            return result;
        }
    }

    getPerformanceStats() {
        const totalOperations = this.stats.cacheHits + this.stats.cacheMisses;
        const hitRate = totalOperations > 0 ? (this.stats.cacheHits / totalOperations) * 100 : 0;
        
        return {
            ...this.stats,
            hitRate: hitRate.toFixed(2),
            totalOperations,
            cacheSize: this.operationCache.size + this.functionCache.size
        };
    }

    clearCache() {
        this.operationCache.clear();
        this.functionCache.clear();
    }
}

export const speedBooster = new SpeedBooster();