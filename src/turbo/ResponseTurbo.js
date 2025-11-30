export class ResponseTurbo {
    constructor() {
        this.responseCache = new Map();
        this.pendingRequests = new Map();
        this.stats = {
            cachedResponses: 0,
            instantResponses: 0,
            responseTimeSaved: 0,
            duplicatePrevented: 0
        };
    }

    async instantResponse(key, operation, ttl = 10000) {
        const startTime = performance.now();
        
        if (this.responseCache.has(key)) {
            this.stats.cachedResponses++;
            this.stats.responseTimeSaved += performance.now() - startTime;
            return this.responseCache.get(key);
        }
        
        if (this.pendingRequests.has(key)) {
            this.stats.duplicatePrevented++;
            return this.pendingRequests.get(key);
        }
        
        const promise = operation();
        this.pendingRequests.set(key, promise);
        
        try {
            const result = await promise;
            this.responseCache.set(key, result);
            setTimeout(() => this.responseCache.delete(key), ttl);
            this.stats.instantResponses++;
            return result;
        } finally {
            this.pendingRequests.delete(key);
        }
    }

    preheat(key, operation) {
        if (!this.responseCache.has(key) && !this.pendingRequests.has(key)) {
            this.instantResponse(key, operation);
        }
    }

    getStats() {
        return {
            ...this.stats,
            cacheSize: this.responseCache.size,
            pendingCount: this.pendingRequests.size
        };
    }

    clear() {
        this.responseCache.clear();
        this.pendingRequests.clear();
    }
}

export const responseTurbo = new ResponseTurbo();
