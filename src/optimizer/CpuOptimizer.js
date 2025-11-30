import pLimit from 'p-limit';

export class CpuOptimizer {
    constructor() {
        this.limiter = pLimit(3);
        this.activeOperations = new Map();
        this.stats = {
            limitedOperations: 0,
            queueSize: 0,
            completedOperations: 0
        };
    }

    limitConcurrency(fn, operationId = 'unknown') {
        return async (...args) => {
            this.stats.limitedOperations++;
            this.activeOperations.set(operationId, { start: Date.now() });
            
            try {
                const result = await this.limiter(() => fn(...args));
                this.stats.completedOperations++;
                return result;
            } finally {
                this.activeOperations.delete(operationId);
                this.stats.queueSize = this.limiter.pendingCount;
            }
        };
    }

    setConcurrencyLimit(limit) {
        this.limiter = pLimit(Math.max(1, limit));
    }

    getStats() {
        return {
            ...this.stats,
            activeOperations: this.activeOperations.size,
            pendingCount: this.limiter.pendingCount
        };
    }
}

export const cpuOptimizer = new CpuOptimizer();