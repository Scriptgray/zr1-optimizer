export class MemoryOptimizer {
    constructor() {
        this.cleanupInterval = null;
        this.stats = {
            garbageCollections: 0,
            memoryFreed: 0,
            optimizations: 0
        };
    }

    enableAutoCleanup(interval = 30000) {
        this.cleanupInterval = setInterval(() => {
            const beforeMem = process.memoryUsage().heapUsed;
            
            if (global.gc) {
                global.gc();
                this.stats.garbageCollections++;
            }
            
            const afterMem = process.memoryUsage().heapUsed;
            this.stats.memoryFreed += (beforeMem - afterMem);
            this.stats.optimizations++;
            
        }, interval);
    }

    forceCleanup() {
        const beforeMem = process.memoryUsage().heapUsed;
        
        if (global.gc) {
            global.gc();
            this.stats.garbageCollections++;
        }
        
        const afterMem = process.memoryUsage().heapUsed;
        this.stats.memoryFreed += (beforeMem - afterMem);
        this.stats.optimizations++;
        
        return this.stats;
    }

    getStats() {
        const memory = process.memoryUsage();
        return {
            ...this.stats,
            currentMemory: Math.round(memory.heapUsed / 1024 / 1024) + ' MB',
            memoryUsage: ((memory.heapUsed / memory.heapTotal) * 100).toFixed(1) + '%'
        };
    }

    disable() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
    }
}

export const memoryOptimizer = new MemoryOptimizer();