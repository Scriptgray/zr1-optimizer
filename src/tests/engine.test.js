import { Engine } from '../src/core/Engine.js';

console.log('🧪 Probando ZR1 Optimizer...');

function testInitialization() {
    try {
        const engine = new Engine();
        
        const stats = engine.getStats();
        
        engine.shutdown();
        
        return true;
    } catch (error) {
        console.log('❌ Error en inicialización:', error.message);
        return false;
    }
}

function testCache() {
    try {
        const engine = new Engine();
        
        const result = engine.executeWithLimit(
            () => Promise.resolve('test'),
            'test-operation'
        );
        
        engine.shutdown();
        return true;
    } catch (error) {
        console.log('❌ Error en prueba de cache:', error.message);
        return false;
    }
}

const test1 = testInitialization();
const test2 = testCache();

if (test1 && test2) {
    console.log('✅ Todas las pruebas pasaron');
    process.exit(0);
} else {
    console.log('❌ Algunas pruebas fallaron');
    process.exit(1);
          }
