import { EventEmitter } from 'events';

export class EventOptimizer {
    constructor() {
        this.originalEmit = EventEmitter.prototype.emit;
    }

    enable() {
        const self = this;
        
        EventEmitter.prototype.emit = function(event, ...args) {
            return self.originalEmit.apply(this, [event, ...args]);
        };
    }

    disable() {
        EventEmitter.prototype.emit = this.originalEmit;
    }
}