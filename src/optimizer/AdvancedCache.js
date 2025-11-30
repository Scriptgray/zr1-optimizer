export class AdvancedCache {
    constructor() {
        this.l1Cache = new Map();
        this.l2Cache = new Map();
        this.l3Cache = new Map();
        this.stats = {
            l1Hits: 0,
            l2Hits: 0,
            l3Hits: 0,
            misses: 0,
            timeSaved: 0,
            memorySaved: 0
        };
    }

    async get(key, fetchFn, options = {}) {
        const startTime = Date.now();
        const { ttl = 30000, priority = 'medium', compress = false } = options;
        
        if (this.l1Cache.has(key)) {
            this.stats.l1Hits++;
            this.stats.timeSaved += Date.now() - startTime;
            return this.l1Cache.get(key);
        }
        
        if (this.l2Cache.has(key)) {
            this.stats.l2Hits++;
            this.stats.timeSaved += Date.now() - startTime;
            const result = this.l2Cache.get(key);
            this.l1Cache.set(key, result);
            return result;
        }
        
        if (this.l3Cache.has(key)) {
            this.stats.l3Hits++;
            this.stats.timeSaved += Date.now() - startTime;
            const result = this.l3Cache.get(key);
            this.l2Cache.set(key, result);
            return result;
        }
        
        this.stats.misses++;
        const result = await fetchFn();
        
        if (compress && typeof result === 'string' && result.length > 1000) {
            this.stats.memorySaved += result.length;
        }
        
        this.set(key, result, { ttl, priority });
        return result;
    }

    set(key, value, options = {}) {
        const { ttl = 30000, priority = 'medium' } = options;
        
        switch (priority) {
            case 'high':
                this.l1Cache.set(key, value);
                setTimeout(() => this.l1Cache.delete(key), ttl);
                break;
            case 'medium':
                this.l2Cache.set(key, value);
                setTimeout(() => this.l2Cache.delete(key), ttl);
                break;
            case 'low':
                this.l3Cache.set(key, value);
                setTimeout(() => this.l3Cache.delete(key), ttl);
                break;
        }
    }

    preload(keys, fetchFn, options = {}) {
        return Promise.all(
            keys.map(key => this.get(key, () => fetchFn(key), options))
        );
    }

    getStats() {
        const totalHits = this.stats.l1Hits + this.stats.l2Hits + this.stats.l3Hits;
        const totalRequests = totalHits + this.stats.misses;
        const hitRate = totalRequests > 0 ? (totalHits / totalRequests) * 100 : 0;
        
        return {
            ...this.stats,
            hitRate: hitRate.toFixed(2),
            totalRequests,
            cacheSizes: {
                l1: this.l1Cache.size,
                l2: this.l2Cache.size,
                l3: this.l3Cache.size
            },
            memorySaved: Math.round(this.stats.memorySaved / 1024) + ' KB'
        };
    }

    clear() {
        this.l1Cache.clear();
        this.l2Cache.clear();
        this.l3Cache.clear();
    }
}

export const advancedCache = new AdvancedCache();