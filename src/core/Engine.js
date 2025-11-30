import { Memory } from '../utils/Memory.js';
import { Metrics } from '../utils/Metrics.js';
import { CacheManager } from './CacheManager.js';
import { PerformanceMonitor } from './PerformanceMonitor.js';
import { PromiseOptimizer } from '../optimizer/PromiseOptimizer.js';
import { TimerOptimizer } from '../optimizer/TimerOptimizer.js';
import { EventOptimizer } from '../optimizer/EventOptimizer.js';
import { FsOptimizer } from '../optimizer/FsOptimizer.js';
import pLimit from 'p-limit';

export class Engine {
    constructor() {
        console.log('\x1b[31m%s\x1b[0m', '🚀 ZR1 OPTIMIZER ESTÁ LISTO - Turbo activado');
        
        this.memoryLimit = Memory.detectMemoryLimit();
        this.cpuCores = Memory.getCpuCores();
        
        this.metrics = new Metrics();
        this.cacheManager = new CacheManager(this.memoryLimit);
        this.performanceMonitor = new PerformanceMonitor();
        
        this.setupConcurrencyControl();
        this.setupOptimizers();
        this.startMaintenanceCycle();
    }

    setupConcurrencyControl() {
        this.concurrencyLimit = Math.max(3, Math.floor(this.cpuCores * 2.5));
        this.limiter = pLimit(this.concurrencyLimit);
        this.activeOperations = new Set();
    }

    setupOptimizers() {
        this.promiseOptimizer = new PromiseOptimizer(this.cacheManager, this.metrics);
        this.timerOptimizer = new TimerOptimizer();
        this.eventOptimizer = new EventOptimizer(this.cacheManager);
        this.fsOptimizer = new FsOptimizer(this.cacheManager, this.metrics);

        this.promiseOptimizer.enable();
        this.timerOptimizer.enable();
        this.eventOptimizer.enable();
        this.fsOptimizer.enable();
    }

    startMaintenanceCycle() {
        this.maintenanceInterval = setInterval(() => {
            this.performMaintenance();
        }, 25000);
    }

    performMaintenance() {
        const hitRate = this.cacheManager.getHitRate();
        const memoryPressure = Memory.hasMemoryPressure();
        
        this.cacheManager.adjustSize(hitRate, memoryPressure);
        
        if (hitRate < 0.15 || memoryPressure) {
            this.cacheManager.clear();
            Memory.cleanTemporaryMemory();
        }
    }

    async executeWithLimit(fn, operationId = 'unknown') {
        this.metrics.recordOperation();
        
        const measurement = this.performanceMonitor.startMeasurement(operationId);
        this.activeOperations.add(operationId);
        
        try {
            const result = await this.limiter(() => fn());
            return result;
        } finally {
            this.activeOperations.delete(operationId);
            const duration = measurement.end();
            
            if (duration > 800) {
                this.metrics.recordSlowOperation();
            }
        }
    }

    getStats() {
        return {
            metrics: this.metrics.getSummary(),
            cache: this.cacheManager.getStats(),
            memory: Memory.getMemoryUsage(),
            performance: {
                longTasks: this.performanceMonitor.getLongTasks(),
                activeOperations: this.activeOperations.size
            },
            configuration: {
                concurrencyLimit: this.concurrencyLimit,
                cacheSize: this.cacheManager.cache.maxSize,
                memoryLimit: this.memoryLimit
            }
        };
    }

    shutdown() {
        if (this.maintenanceInterval) {
            clearInterval(this.maintenanceInterval);
        }
        
        this.promiseOptimizer.disable();
        this.timerOptimizer.disable();
        this.eventOptimizer.disable();
        this.fsOptimizer.disable();
        
        this.cacheManager.clear();
        this.activeOperations.clear();
    }
}
