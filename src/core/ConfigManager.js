export class ConfigManager {
    constructor() {
        this.config = new Map();
        this.defaults = new Map();
        this.loadEnvironment();
    }

    set(key, value) {
        this.config.set(key, value);
        return this;
    }

    get(key, defaultValue = null) {
        return this.config.get(key) || this.defaults.get(key) || defaultValue;
    }

    setDefault(key, value) {
        this.defaults.set(key, value);
        return this;
    }

    loadEnvironment() {
        Object.keys(process.env).forEach(key => {
            if (key.startsWith('ZR1_')) {
                const configKey = key.slice(4).toLowerCase();
                this.set(configKey, this.parseValue(process.env[key]));
            }
        });
    }

    parseValue(value) {
        if (value === 'true') return true;
        if (value === 'false') return false;
        if (value === 'null') return null;
        if (!isNaN(value) && value !== '') return Number(value);
        return value;
    }

    toObject() {
        return Object.fromEntries(this.config);
    }
}

export const configManager = new ConfigManager();