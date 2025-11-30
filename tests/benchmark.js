import { zr1, speedBooster, responseTurbo } from '../src/index.js';

async function benchmark() {
  console.log('🧪 INICIANDO BENCHMARK ZR1 OPTIMIZER\n');
  
  const startTime = Date.now();
  const iterations = 100;
  
  for (let i = 0; i < iterations; i++) {
    await responseTurbo.instantResponse(
      `bench:${i}`,
      async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return `result-${i}`;
      }
    );
  }
  
  const endTime = Date.now();
  const totalTime = endTime - startTime;
  const stats = zr1.getAllStats();
  
  console.log('📊 RESULTADOS DEL BENCHMARK:');
  console.log(`• Iteraciones: ${iterations}`);
  console.log(`• Tiempo total: ${totalTime}ms`);
  console.log(`• Tiempo promedio: ${(totalTime / iterations).toFixed(2)}ms`);
  console.log(`• Cache hits: ${stats.response?.cacheHits || 0}`);
  console.log(`• Tiempo ahorrado: ${stats.response?.responseTimeSaved || 0}ms`);
  console.log(`• Eficiencia: ${((stats.response?.cacheHits / iterations) * 100).toFixed(1)}%`);
}

benchmark();