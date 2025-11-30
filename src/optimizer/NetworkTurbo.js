export class NetworkTurbo {
    constructor() {
        this.connectionPool = new Map();
        this.dnsCache = new Map();
        this.requestCache = new Map();
        this.stats = {
            requests: 0,
            cachedRequests: 0,
            dnsCacheHits: 0,
            timeSaved: 0,
            connectionsReused: 0
        };
    }

    async fetch(url, options = {}) {
        const startTime = performance.now();
        const cacheKey = `fetch:${url}:${JSON.stringify(options)}`;
        
        if (this.requestCache.has(cacheKey)) {
            this.stats.cachedRequests++;
            this.stats.timeSaved += performance.now() - startTime;
            return this.requestCache.get(cacheKey);
        }
        
        this.stats.requests++;
        
        const optimizedOptions = {
            ...options,
            keepalive: true,
            timeout: 10000,
            highWaterMark: 1024 * 1024
        };
        
        try {
            const response = await global.fetch(url, optimizedOptions);
            const data = await response.json();
            
            this.requestCache.set(cacheKey, data);
            setTimeout(() => this.requestCache.delete(cacheKey), 30000);
            
            return data;
        } catch (error) {
            throw error;
        }
    }

    batchRequests(requests, batchSize = 5) {
        const batches = [];
        for (let i = 0; i < requests.length; i += batchSize) {
            batches.push(requests.slice(i, i + batchSize));
        }
        
        return Promise.all(
            batches.map(batch => 
                Promise.allSettled(
                    batch.map(req => this.fetch(req.url, req.options))
                )
            )
        ).then(results => results.flat());
    }

    preloadResources(urls) {
        return this.batchRequests(
            urls.map(url => ({ url, options: { method: 'GET' } })),
            3
        );
    }

    optimizeDNS(hostname) {
        if (this.dnsCache.has(hostname)) {
            this.stats.dnsCacheHits++;
            return Promise.resolve(this.dnsCache.get(hostname));
        }
        
        return new Promise((resolve) => {
            setTimeout(() => {
                const result = { address: hostname, ttl: 30000 };
                this.dnsCache.set(hostname, result);
                setTimeout(() => this.dnsCache.delete(hostname), 30000);
                resolve(result);
            }, 0);
        });
    }

    getStats() {
        return {
            ...this.stats,
            cacheSize: this.requestCache.size,
            dnsCacheSize: this.dnsCache.size
        };
    }

    clearCache() {
        this.requestCache.clear();
        this.dnsCache.clear();
    }
}

export const networkTurbo = new NetworkTurbo();