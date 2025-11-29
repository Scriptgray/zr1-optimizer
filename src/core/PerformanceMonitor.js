import { performance } from 'perf_hooks';

export class PerformanceMonitor {
    constructor() {
        this.slowOperationThreshold = 800;
        this.longTasks = new Set();
    }

    startMeasurement(operationId) {
        const startTime = performance.now();
        return {
            end: () => {
                const duration = performance.now() - startTime;
                if (duration > this.slowOperationThreshold) {
                    this.recordLongTask(operationId, duration);
                }
                return duration;
            }
        };
    }

    recordLongTask(operationId, duration) {
        this.longTasks.add({
            id: operationId,
            duration: Math.round(duration),
            timestamp: Date.now()
        });

        if (this.longTasks.size > 100) {
            const tasksArray = Array.from(this.longTasks);
            tasksArray.sort((a, b) => b.timestamp - a.timestamp);
            this.longTasks = new Set(tasksArray.slice(0, 50));
        }
    }

    getLongTasks() {
        return Array.from(this.longTasks);
    }

    setSlowThreshold(threshold) {
        this.slowOperationThreshold = threshold;
    }
}
