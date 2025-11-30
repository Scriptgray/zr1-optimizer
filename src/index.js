import { v8Optimizer } from './optimizer/V8Optimizer.js';
import { advancedCache } from './optimizer/AdvancedCache.js';
import { responseTurbo } from './turbo/ResponseTurbo.js';
import { speedInjector } from './turbo/SpeedInjector.js';
import { executionTurbo } from './turbo/ExecutionTurbo.js';

v8Optimizer.enableDeepOptimization();

console.log('\x1b[31m%s\x1b[0m', '🚀 ZR1 TURBO ACTIVADO - Velocidad extrema');

export { 
    v8Optimizer,
    advancedCache,
    responseTurbo,
    speedInjector,
    executionTurbo
};