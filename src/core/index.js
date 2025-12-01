// src/index.js
import { UltraModeScraper } from './scraper.js';

// Muestra el mensaje de inicio
console.log('SCRAPER BY ABRAHAN-M OPTIMIZAR TU BOT');
console.log('-----------------------------------------');

const scraper = new UltraModeScraper();

// --- Demostración de la gestión de conexiones y caché ---
async function demo() {
  console.log('--- Iniciando demostración con peticiones en paralelo ---');

  const urls = [
    'https://ejemplo.com/recurso1',
    'https://ejemplo.com/recurso2',
    'https://ejemplo.com/recurso3',
    'https://ejemplo.com/recurso4',
    'https://ejemplo.com/recurso5',
    'https://ejemplo.com/recurso6', // Esta tendrá que esperar a que se libere una conexión
  ];

  // Lanza todas las peticiones en paralelo
  const peticiones = urls.map(url => scraper.fetch(url));
  await Promise.all(peticiones);

  console.log('\n--- Petición a un recurso ya cacheado ---');
  await scraper.fetch('https://ejemplo.com/recurso1');
  
  console.log('-----------------------------------------');
}

// Función para mostrar el reporte de optimización
const mostrarReporteDeOptimizacion = () => {
  const cacheStats = scraper.getCacheStats();
  const connStats = scraper.getConnectionStats();
  
  console.log(`[${new Date().toLocaleTimeString()}] Reporte de optimización:`);
  console.log('  Módulo de Caché:');
  console.log(`    - Aciertos: ${cacheStats.hits}, Fallos: ${cacheStats.misses}, Tasa de aciertos: ${cacheStats.hitRate}`);
  console.log('  Módulo de Conexiones:');
  console.log(`    - Disponibles: ${connStats.available}, Activas: ${connStats.active}`);
  console.log('-----------------------------------------');
};

// Ejecuta la demo y luego empieza a monitorizar
demo().then(() => {
  console.log("\nMonitorizando el rendimiento... El primer reporte será en 10 minutos.");
  
  const DIEZ_MINUTOS_EN_MS = 10 * 60 * 1000;
  setInterval(mostrarReporteDeOptimizacion, DIEZ_MINUTOS_EN_MS);
});
    
