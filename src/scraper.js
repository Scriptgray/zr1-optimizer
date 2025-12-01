// src/scraper.js

import { CacheManager } from './core/cache.js';

/**
 * La clase principal de la librería, que orquesta las optimizaciones.
 */
export class UltraModeScraper {
  constructor() {
    this.cache = new CacheManager();
    console.log('UltraModeScraper inicializado con el módulo de caché.');
  }

  /**
   * Obtiene el contenido de una URL, utilizando la caché para optimizar la velocidad.
   * @param {string} url - La URL de la que se quiere obtener el contenido.
   * @returns {Promise<string>} El contenido de la página.
   */
  async fetch(url) {
    // 1. Revisa la caché primero
    const cachedContent = this.cache.get(url);
    if (cachedContent) {
      console.log(`[CACHE HIT] Obteniendo '${url}' desde la caché.`);
      return cachedContent;
    }

    // 2. Si no está en la caché, simula una petición de red
    console.log(`[CACHE MISS] '${url}' no encontrado en la caché. Realizando petición de red...`);
    const content = await this.simulateNetworkRequest(url);

    // 3. Almacena la nueva respuesta en la caché
    this.cache.set(url, content);
    console.log(`[CACHE SET] Guardando la respuesta de '${url}' en la caché.`);

    return content;
  }

  /**
   * Simula una petición de red con una latencia artificial.
   * @private
   */
  simulateNetworkRequest(url) {
    return new Promise(resolve => {
      // Latencia aleatoria entre 200ms y 700ms
      const latency = Math.random() * 500 + 200;
      setTimeout(() => {
        resolve(`<html><body>Contenido de ${url}</body></html>`);
      }, latency);
    });
  }

  /**
   * Devuelve las estadísticas de la caché.
   */
  getCacheStats() {
    return this.cache.getStats();
  }
}
