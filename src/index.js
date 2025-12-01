// src/index.js
import { UltraModeScraper } from './scraper.js';

// Muestra el mensaje de inicio
console.log('SCRAPER BY ABRAHAN-M OPTIMIZAR TU BOT');
console.log('-----------------------------------------');

const scraper = new UltraModeScraper();

// --- Demostración de la funcionalidad de caché ---
async function demo() {
  const url1 = 'https://ejemplo.com/pagina1';
  const url2 = 'https://ejemplo.com/pagina2';

  console.log('--- Demostración Inicial ---');
  await scraper.fetch(url1); // Miss
  await scraper.fetch(url1); // Hit
  await scraper.fetch(url2); // Miss
  console.log('-----------------------------------------');
}

// Función para mostrar el reporte de optimización
const mostrarReporteDeOptimizacion = () => {
  const stats = scraper.getCacheStats();
  console.log(`[${new Date().toLocaleTimeString()}] Reporte de optimización:`);
  console.log(`  - Aciertos de caché: ${stats.hits} (Peticiones ahorradas)`);
  console.log(`  - Fallos de caché: ${stats.misses}`);
  console.log(`  - Tasa de aciertos: ${stats.hitRate}`);
  console.log('-----------------------------------------');
};


// Ejecuta la demo y luego empieza a monitorizar
demo().then(() => {
  console.log("\nMonitorizando el rendimiento... El primer reporte será en 10 minutos.");

  // Establece un intervalo para mostrar el reporte cada 10 minutos
  const DIEZ_MINUTOS_EN_MS = 10 * 60 * 1000;
  setInterval(mostrarReporteDeOptimizacion, DIEZ_MINUTOS_EN_MS);
});
