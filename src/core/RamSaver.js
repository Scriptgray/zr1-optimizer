export class RamSaver {
    constructor() {
        this.cleanupInterval = null;
        this.memoryLimit = 0.8;
    }

    start() {
        this.cleanupInterval = setInterval(() => {
            this.cleanMemory();
        }, 30000);
    }

    cleanMemory() {
        const memory = process.memoryUsage();
        const usage = memory.heapUsed / memory.heapTotal;
        
        if (usage > this.memoryLimit) {
            if (global.gc) {
                global.gc();
            }
            
            this.clearModuleCache();
        }
    }

    clearModuleCache() {
        Object.keys(require.cache).forEach(key => {
            if (!key.includes('node_modules') && 
                !key.includes('zr1-optimizer') &&
                !key.includes('/core/') &&
                !key.includes('/optimizer/')) {
                delete require.cache[key];
            }
        });
    }

    stop() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
        }
    }
}

export const ramSaver = new RamSaver();