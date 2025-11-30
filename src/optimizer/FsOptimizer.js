import fs from 'fs';

export class FsOptimizer {
    constructor(cacheManager, metrics) {
        this.cacheManager = cacheManager;
        this.metrics = metrics;
        this.originalReadFile = fs.readFile;
        this.originalReadFileSync = fs.readFileSync;
    }

    enable() {
        const self = this;

        fs.readFile = function(path, options, callback) {
            const encoding = typeof options === 'object' ? options.encoding : 'buffer';
            const cacheKey = `fs.readFile:${path}:${encoding}`;
            const cached = self.cacheManager.get(cacheKey);
            const cb = typeof options === 'function' ? options : callback;

            fs.stat(path, (statErr, stats) => {
                if (statErr) {
                    return self.originalReadFile.call(this, path, options, cb);
                }

                if (cached && cached.mtime === stats.mtime.toISOString()) {
                    if (typeof options === 'function') {
                        options(null, cached.data);
                    } else if (typeof callback === 'function') {
                        callback(null, cached.data);
                    }
                    return;
                }

                self.originalReadFile.call(this, path, options, (err, data) => {
                    if (!err) {
                        self.cacheManager.set(cacheKey, {
                            data,
                            mtime: stats.mtime.toISOString()
                        });
                    }
                    cb(err, data);
                });
            });
        };

        fs.readFileSync = function(path, options) {
            const encoding = typeof options === 'object' ? options.encoding : 'buffer';
            const cacheKey = `fs.readFileSync:${path}:${encoding}`;
            const cached = self.cacheManager.get(cacheKey);

            try {
                const stats = fs.statSync(path);

                if (cached && cached.mtime === stats.mtime.toISOString()) {
                    return cached.data;
                }

                const data = self.originalReadFileSync.call(this, path, options);
                self.cacheManager.set(cacheKey, {
                    data,
                    mtime: stats.mtime.toISOString()
                });
                return data;
            } catch (e) {
                return self.originalReadFileSync.call(this, path, options);
            }
        };
    }

    disable() {
        fs.readFile = this.originalReadFile;
        fs.readFileSync = this.originalReadFileSync;
    }
}
