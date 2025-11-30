export class DatabaseOptimizer {
    constructor() {
        this.stats = {
            queries: 0,
            cachedQueries: 0
        };
    }

    cachedQuery(queryKey, queryFn) {
        this.stats.queries++;
        return queryFn();
    }

    batchQueries(queries) {
        return Promise.all(
            queries.map(query => this.cachedQuery(query.key, query.fn))
        );
    }

    getStats() {
        return { ...this.stats };
    }
}

export const databaseOptimizer = new DatabaseOptimizer();