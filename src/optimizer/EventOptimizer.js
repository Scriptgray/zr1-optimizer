export class EventOptimizer {
    constructor(cacheManager) {
        this.cacheManager = cacheManager;
        this.originalEmit = require('events').EventEmitter.prototype.emit;
    }

    enable() {
        const self = this;
        
        require('events').EventEmitter.prototype.emit = function(event, ...args) {
            const eventKey = `event:${this.constructor.name}:${event}:${JSON.stringify(args)}`;
            
            if (self.cacheManager.has(eventKey)) {
                return true;
            }

            self.cacheManager.set(eventKey, true, { maxAge: 400 });
            return self.originalEmit.apply(this, [event, ...args]);
        };
    }

    disable() {
        require('events').EventEmitter.prototype.emit = this.originalEmit;
    }
}
