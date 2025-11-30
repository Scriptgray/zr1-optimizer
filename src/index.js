import { Engine } from './core/Engine.js';
import { speedBooster } from './optimizer/SpeedBooster.js';
import { memoryOptimizer } from './optimizer/MemoryOptimizer.js';
import { networkOptimizer } from './optimizer/NetworkOptimizer.js';
import { eventLoopOptimizer } from './optimizer/EventLoopOptimizer.js';
import { databaseOptimizer } from './optimizer/DatabaseOptimizer.js';

const zr1Engine = new Engine();

memoryOptimizer.enableAutoCleanup();
eventLoopOptimizer.enableMonitoring();

export default Engine;
export { 
    zr1Engine, 
    speedBooster, 
    memoryOptimizer, 
    networkOptimizer, 
    eventLoopOptimizer, 
    databaseOptimizer
};

process.on('SIGINT', () => {
    zr1Engine.shutdown();
    memoryOptimizer.disable();
    eventLoopOptimizer.disable();
    process.exit(0);
});

process.on('SIGTERM', () => {
    zr1Engine.shutdown();
    memoryOptimizer.disable();
    eventLoopOptimizer.disable();
    process.exit(0);
});