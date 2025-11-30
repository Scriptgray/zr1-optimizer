export class InstantLoader {
    constructor() {
        this.preloaded = new Map();
        this.lazyQueue = new Map();
        this.stats = {
            preloadedItems: 0,
            instantLoads: 0,
            lazyLoads: 0,
            timeSaved: 0
        };
    }

    preload(key, loaderFn) {
        if (!this.preloaded.has(key)) {
            this.preloaded.set(key, loaderFn());
            this.stats.preloadedItems++;
        }
        return this;
    }

    async get(key, fallbackFn) {
        const startTime = performance.now();
        
        if (this.preloaded.has(key)) {
            this.stats.instantLoads++;
            this.stats.timeSaved += performance.now() - startTime;
            return this.preloaded.get(key);
        }
        
        if (this.lazyQueue.has(key)) {
            return this.lazyQueue.get(key);
        }
        
        this.stats.lazyLoads++;
        const promise = fallbackFn();
        this.lazyQueue.set(key, promise);
        
        const result = await promise;
        this.lazyQueue.delete(key);
        this.preloaded.set(key, result);
        
        return result;
    }

    preloadMultiple(items) {
        items.forEach(([key, loader]) => this.preload(key, loader));
        return this;
    }

    getStats() {
        return {
            ...this.stats,
            preloadedCount: this.preloaded.size,
            queuedCount: this.lazyQueue.size
        };
    }

    clear() {
        this.preloaded.clear();
        this.lazyQueue.clear();
    }
}

export const instantLoader = new InstantLoader();