import { configManager } from './core/ConfigManager.js';
import { logger } from './core/Logger.js';

import { V8Optimizer } from './optimizer/V8Optimizer.js';
import { MemoryOptimizer } from './optimizer/MemoryOptimizer.js';
import { CpuOptimizer } from './optimizer/CpuOptimizer.js';
import { NetworkTurbo } from './optimizer/NetworkTurbo.js';
import { FsOptimizer } from './optimizer/FsOptimizer.js';
import { SpeedBooster } from './optimizer/SpeedBooster.js';
import { AdvancedCache } from './optimizer/AdvancedCache.js';
import { DatabaseOptimizer } from './optimizer/DatabaseOptimizer.js';
import { EventLoopOptimizer } from './optimizer/EventLoopOptimizer.js';

import { ResponseTurbo } from './turbo/ResponseTurbo.js';
import { SpeedInjector } from './turbo/SpeedInjector.js';
import { ExecutionTurbo } from './turbo/ExecutionTurbo.js';
import { InstantLoader } from './turbo/InstantLoader.js';

class ZR1Optimizer {
    constructor(options = {}) {
        this.config = configManager;
        this.logger = logger;
        this.initialized = false;
        
        this.optimizers = new Map();
        this.stats = {
            startTime: Date.now(),
            totalOptimizations: 0
        };
        
        this.setupOptimizers(options);
    }

    setupOptimizers(options) {
        this.v8 = new V8Optimizer();
        this.memory = new MemoryOptimizer();
        this.cpu = new CpuOptimizer();
        this.network = new NetworkTurbo();
        this.fs = new FsOptimizer();
        this.speed = new SpeedBooster();
        this.cache = new AdvancedCache();
        this.database = new DatabaseOptimizer();
        this.eventLoop = new EventLoopOptimizer();
        
        this.response = new ResponseTurbo();
        this.injector = new SpeedInjector();
        this.execution = new ExecutionTurbo();
        this.loader = new InstantLoader();
    }

    initialize() {
        if (this.initialized) return;
        
        this.v8.enableDeepOptimization();
        
        if (this.memory && typeof this.memory.start === 'function') {
            this.memory.start();
        }
        
        this.eventLoop.enableMonitoring();
        
        this.optimizers.set('v8', this.v8);
        this.optimizers.set('memory', this.memory);
        this.optimizers.set('cpu', this.cpu);
        this.optimizers.set('network', this.network);
        this.optimizers.set('fs', this.fs);
        this.optimizers.set('speed', this.speed);
        this.optimizers.set('cache', this.cache);
        this.optimizers.set('database', this.database);
        this.optimizers.set('eventLoop', this.eventLoop);
        this.optimizers.set('response', this.response);
        this.optimizers.set('injector', this.injector);
        this.optimizers.set('execution', this.execution);
        this.optimizers.set('loader', this.loader);
        
        this.initialized = true;
        
        console.log('\x1b[31m%s\x1b[0m\x1b[37m%s\x1b[0m', '🚀 ZR1 OPTIMIZER ', 'ACTIVADO CORRECTAMENTE');
    }

    getOptimizer(name) {
        return this.optimizers.get(name);
    }

    getAllStats() {
        const stats = { ...this.stats };
        
        this.optimizers.forEach((optimizer, name) => {
            if (optimizer.getStats) {
                stats[name] = optimizer.getStats();
            }
        });
        
        stats.uptime = Date.now() - this.stats.startTime;
        stats.optimizerCount = this.optimizers.size;
        
        return stats;
    }
}

const zr1 = new ZR1Optimizer();

export default ZR1Optimizer;
export { 
    zr1,
    V8Optimizer,
    MemoryOptimizer,
    CpuOptimizer,
    NetworkTurbo,
    FsOptimizer,
    SpeedBooster,
    AdvancedCache,
    DatabaseOptimizer,
    EventLoopOptimizer,
    ResponseTurbo,
    SpeedInjector,
    ExecutionTurbo,
    InstantLoader,
    configManager,
    logger
};

setTimeout(() => {
    try {
        zr1.initialize();
    } catch (error) {
    }
}, 1000);