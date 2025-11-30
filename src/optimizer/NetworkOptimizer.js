export class NetworkOptimizer {
    constructor() {
        this.stats = {
            requests: 0,
            cachedRequests: 0
        };
    }

    async optimizedFetch(url, options = {}) {
        this.stats.requests++;
        const response = await fetch(url, options);
        return response.json();
    }

    batchRequests(requests) {
        return Promise.all(
            requests.map(req => this.optimizedFetch(req.url, req.options))
        );
    }

    getStats() {
        return { ...this.stats };
    }
}

export const networkOptimizer = new NetworkOptimizer();