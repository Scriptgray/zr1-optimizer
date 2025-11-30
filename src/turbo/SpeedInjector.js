export class SpeedInjector {
    constructor() {
        this.optimizedMethods = new Map();
        this.methodCache = new Map();
        this.stats = {
            methodsOptimized: 0,
            cacheHits: 0,
            executions: 0,
            timeSaved: 0
        };
    }

    injectSpeed(target, methodName, options = {}) {
        const originalMethod = target[methodName];
        const cacheKey = `method:${methodName}`;
        
        if (typeof originalMethod !== 'function') return;
        
        target[methodName] = async (...args) => {
            this.stats.executions++;
            const startTime = performance.now();
            const argsKey = JSON.stringify(args);
            const fullKey = `${cacheKey}:${argsKey}`;
            
            if (this.methodCache.has(fullKey)) {
                this.stats.cacheHits++;
                this.stats.timeSaved += performance.now() - startTime;
                return this.methodCache.get(fullKey);
            }
            
            const result = await originalMethod.apply(target, args);
            this.methodCache.set(fullKey, result);
            
            if (options.ttl) {
                setTimeout(() => this.methodCache.delete(fullKey), options.ttl);
            }
            
            return result;
        };
        
        this.optimizedMethods.set(methodName, target[methodName]);
        this.stats.methodsOptimized++;
    }

    injectMultiple(target, methods) {
        methods.forEach(method => {
            if (typeof method === 'string') {
                this.injectSpeed(target, method);
            } else {
                this.injectSpeed(target, method.name, method.options);
            }
        });
    }

    getStats() {
        return {
            ...this.stats,
            optimizedCount: this.optimizedMethods.size,
            cacheSize: this.methodCache.size
        };
    }

    clearCache() {
        this.methodCache.clear();
    }
}

export const speedInjector = new SpeedInjector();