import QuickLRU from 'quick-lru';

export class CacheManager {
    constructor(memoryLimit) {
        const cacheSize = Math.floor(memoryLimit / 1024 / 1024) * 25;
        
        this.cache = new QuickLRU({ 
            maxSize: Math.max(150, cacheSize),
            maxAge: 35000
        });
        
        this.stats = {
            sets: 0,
            gets: 0,
            hits: 0,
            misses: 0
        };
    }

    set(key, value, options = {}) {
        this.stats.sets++;
        this.cache.set(key, value, options);
        return value;
    }

    get(key) {
        this.stats.gets++;
        if (this.cache.has(key)) {
            this.stats.hits++;
            return this.cache.get(key);
        }
        this.stats.misses++;
        return undefined;
    }

    has(key) {
        return this.cache.has(key);
    }

    clear() {
        this.cache.clear();
        this.stats.gets = 0;
        this.stats.sets = 0;
        this.stats.hits = 0;
        this.stats.misses = 0;
    }

    getHitRate() {
        const total = this.stats.hits + this.stats.misses;
        return total > 0 ? this.stats.hits / total : 0;
    }

    getStats() {
        return {
            ...this.stats,
            size: this.cache.size,
            hitRate: this.getHitRate()
        };
    }

    adjustSize(hitRate, memoryPressure) {
        if (hitRate > 0.65 && !memoryPressure) {
            this.cache.maxSize = Math.min(this.cache.maxSize * 1.15, 8000);
        } else if (hitRate < 0.25 || memoryPressure) {
            this.cache.maxSize = Math.max(this.cache.maxSize * 0.85, 200);
        }
    }
}
