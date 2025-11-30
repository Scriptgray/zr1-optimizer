export class CpuOptimizer {
    constructor() {
        this.activeOperations = new Map();
        this.maxConcurrent = 3;
        this.stats = {
            limitedOperations: 0,
            completedOperations: 0,
            waitingOperations: 0
        };
    }

    async limitConcurrency(fn, operationId = 'unknown') {
        this.stats.limitedOperations++;
        
        while (this.activeOperations.size >= this.maxConcurrent) {
            this.stats.waitingOperations++;
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        
        this.activeOperations.set(operationId, { start: Date.now() });
        
        try {
            const result = await fn();
            this.stats.completedOperations++;
            return result;
        } finally {
            this.activeOperations.delete(operationId);
        }
    }

    setConcurrencyLimit(limit) {
        this.maxConcurrent = Math.max(1, limit);
    }

    getStats() {
        return {
            ...this.stats,
            activeOperations: this.activeOperations.size,
            maxConcurrent: this.maxConcurrent
        };
    }
}

export const cpuOptimizer = new CpuOptimizer();