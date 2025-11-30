export class ExecutionTurbo {
    constructor() {
        this.priorityQueue = [];
        this.normalQueue = [];
        this.isProcessing = false;
        this.stats = {
            priorityExecuted: 0,
            normalExecuted: 0,
            executionTimeSaved: 0,
            queueOptimized: 0
        };
    }

    async executeTurbo(operation, priority = 'normal') {
        const startTime = performance.now();
        
        if (priority === 'high') {
            const result = await operation();
            this.stats.priorityExecuted++;
            this.stats.executionTimeSaved += performance.now() - startTime;
            return result;
        }
        
        return new Promise((resolve, reject) => {
            const task = { operation, resolve, reject, startTime };
            
            if (priority === 'normal') {
                this.normalQueue.push(task);
            }
            
            this.processQueue();
        });
    }

    async processQueue() {
        if (this.isProcessing) return;
        this.isProcessing = true;
        
        while (this.normalQueue.length > 0) {
            const task = this.normalQueue.shift();
            
            try {
                const result = await task.operation();
                this.stats.normalExecuted++;
                this.stats.executionTimeSaved += performance.now() - task.startTime;
                task.resolve(result);
            } catch (error) {
                task.reject(error);
            }
            
            if (this.normalQueue.length > 10) {
                await new Promise(resolve => setTimeout(resolve, 0));
            }
        }
        
        this.isProcessing = false;
    }

    batchExecute(operations, batchSize = 5) {
        const batches = [];
        for (let i = 0; i < operations.length; i += batchSize) {
            batches.push(operations.slice(i, i + batchSize));
        }
        
        return Promise.all(
            batches.map(batch => 
                this.executeTurbo(() => Promise.all(batch.map(op => op())), 'high')
            )
        ).then(results => results.flat());
    }

    getStats() {
        return {
            ...this.stats,
            queueLength: this.normalQueue.length,
            processing: this.isProcessing
        };
    }

    clearQueue() {
        this.priorityQueue = [];
        this.normalQueue = [];
    }
}

export const executionTurbo = new ExecutionTurbo();