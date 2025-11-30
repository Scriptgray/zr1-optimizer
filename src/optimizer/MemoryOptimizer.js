export class MemoryOptimizer {
    constructor() {
        this.cleanupInterval = null;
        this.stats = {
            garbageCollections: 0,
            optimizations: 0
        };
    }

    enableAutoCleanup(interval = 30000) {
        this.cleanupInterval = setInterval(() => {
            this.forceCleanup();
        }, interval);
    }

    forceCleanup() {
        if (global.gc) {
            global.gc();
            this.stats.garbageCollections++;
        }
        this.stats.optimizations++;
        return this.stats;
    }

    getStats() {
        return { ...this.stats };
    }

    disable() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
    }
}

export const memoryOptimizer = new MemoryOptimizer();