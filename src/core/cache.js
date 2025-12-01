// src/core/cache.js

/**
 * CacheManager se encarga de almacenar y gestionar las respuestas en memoria
 * para evitar peticiones redundantes a la misma URL.
 */
export class CacheManager {
  constructor(defaultTtl = 600) { // Tiempo de vida por defecto: 10 minutos
    this.cache = new Map();
    this.defaultTtl = defaultTtl; // en segundos
    this.stats = {
      hits: 0,
      misses: 0,
    };
  }

  /**
   * Almacena un valor en la caché con un tiempo de vida (TTL).
   * @param {string} key - La clave única para el dato (ej. la URL).
   * @param {*} value - El valor a almacenar (ej. el contenido de la página).
   * @param {number} [ttl=this.defaultTtl] - El tiempo de vida en segundos.
   */
  set(key, value, ttl = this.defaultTtl) {
    const expiresAt = Date.now() + ttl * 1000;
    this.cache.set(key, { value, expiresAt });
  }

  /**
   * Recupera un valor de la caché si existe y no ha expirado.
   * @param {string} key - La clave a buscar.
   * @returns {*} El valor almacenado o null si no se encuentra o ha expirado.
   */
  get(key) {
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.misses++;
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return entry.value;
  }

  /**
   * Limpia todas las entradas de la caché.
   */
  clear() {
    this.cache.clear();
    console.log('Caché limpiada.');
  }

  /**
   * Devuelve las estadísticas de uso de la caché.
   * @returns {{hits: number, misses: number, total: number, hitRate: string}}
   */
  getStats() {
    const total = this.stats.hits + this.stats.misses;
    const hitRate = total > 0 ? ((this.stats.hits / total) * 100).toFixed(2) : 0;
    return {
      ...this.stats,
      total,
      hitRate: `${hitRate}%`,
    };
  }
}
