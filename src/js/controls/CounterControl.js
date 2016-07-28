import Control from './Control.js'

/**
 * Represents Control with a counter
 */
export default class CounterControl extends Control {
    /**
     * Initialize CounterControl with specified HTML node and default value
     * @param {HTMLElement} node
     * @param {Number} defaultVal
     */
    constructor(node, defaultVal) {
        super(node);
        this._defaultValue = defaultVal;
    }

    /**
     * Get counter value
     * @returns {Number}
     */
    get value() {
        return this._value;
    }

    /**
     * Set counter value
     * @param {Number} val
     */
    set value(val) {
        this._value = val;
    }

    /**
     * Drop counter to default
     */
    dropValue() {
        this.value = this._defaultValue;
    }
}