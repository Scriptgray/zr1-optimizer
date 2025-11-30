export class CpuOptimizer {
    constructor() {
        this.heavyOperations = new Map();
        this.concurrencyLimit = 3;
    }

    limitConcurrency(fn, operationId) {
        return async (...args) => {
            if (this.heavyOperations.size >= this.concurrencyLimit) {
                await this.waitForSlot();
            }
            
            const operation = { id: operationId, start: Date.now() };
            this.heavyOperations.set(operationId, operation);
            
            try {
                return await fn(...args);
            } finally {
                this.heavyOperations.delete(operationId);
            }
        };
    }

    async waitForSlot() {
        return new Promise(resolve => {
            const check = () => {
                if (this.heavyOperations.size < this.concurrencyLimit) {
                    resolve();
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });
    }

    setConcurrencyLimit(limit) {
        this.concurrencyLimit = Math.max(1, limit);
    }

    getActiveOperations() {
        return this.heavyOperations.size;
    }
}

export const cpuOptimizer = new CpuOptimizer();