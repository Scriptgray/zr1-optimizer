import { v8Optimizer } from './optimizer/V8Optimizer.js';
import { advancedCache } from './optimizer/AdvancedCache.js';
import { networkTurbo } from './optimizer/NetworkTurbo.js';
import { speedBooster } from './optimizer/SpeedBooster.js';
import { memoryOptimizer } from './optimizer/MemoryOptimizer.js';

v8Optimizer.enableDeepOptimization();
memoryOptimizer.start();

console.log('\x1b[31m%s\x1b[0m', '🚀 ZR1 OPTIMIZER AVANZADO ACTIVADO');

export { 
    v8Optimizer,
    advancedCache, 
    networkTurbo,
    speedBooster,
    memoryOptimizer
};