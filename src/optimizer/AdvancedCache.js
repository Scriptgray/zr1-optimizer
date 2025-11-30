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
        const startTime = performance.now();
        const { ttl = 30000, priority = 'medium', compress = false } = options;
        
        if (this.l1Cache.has(key)) {
            this.stats.l1Hits++;
            this.stats.timeSaved += performance.now() - startTime;
            return this.l1Cache.get(key);
        }
        
        if (this.l2Cache.has(key)) {
            this.stats.l2Hits++;
            this.stats.timeSaved += performance.now() - startTime;
            const result = this.l2Cache.get(key);
            this.l1Cache.set(key, result);
            return result;
        }
        
        if (this.l3Cache.has(key)) {
            this.stats.l3Hits++;
            this.stats.timeSaved += performance.now() - startTime;
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