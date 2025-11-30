import { EventEmitter } from 'events';

export class EventOptimizer {
    constructor(cacheManager) {
        this.cacheManager = cacheManager;
        this.originalEmit = EventEmitter.prototype.emit;
    }

    enable() {
        const self = this;
        
        EventEmitter.prototype.emit = function(event, ...args) {
            const eventKey = `event:${this.constructor.name}:${event}:${JSON.stringify(args)}`;
            
            if (self.cacheManager.has(eventKey)) {
                return true;
            }

            self.cacheManager.set(eventKey, true, { maxAge: 400 });
            return self.originalEmit.apply(this, [event, ...args]);
        };
    }

    disable() {
        EventEmitter.prototype.emit = this.originalEmit;
    }
}
