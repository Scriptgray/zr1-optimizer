export class Metrics {
    constructor() {
        this.data = {
            totalOperations: 0,
            cacheHits: 0,
            limitedOperations: 0,
            slowOperations: 0,
            startTime: Date.now()
        };
    }

    recordOperation() {
        this.data.totalOperations++;
    }

    recordCacheHit() {
        this.data.cacheHits++;
    }

    recordSlowOperation() {
        this.data.slowOperations++;
    }

    getHitRate() {
        const total = this.data.cacheHits + (this.data.totalOperations - this.data.cacheHits);
        return total > 0 ? this.data.cacheHits / total : 0;
    }

    getUptime() {
        return Date.now() - this.data.startTime;
    }

    getSummary() {
        return {
            ...this.data,
            hitRate: this.getHitRate(),
            uptime: this.getUptime()
        };
    }
}
