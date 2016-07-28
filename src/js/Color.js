import {getRandomInt} from './Utils.js';

/**
 * RGB Color.
 */
export default class Color {

    /**
     * Create Color
     * @param {Number} r Red
     * @param {Number} g Green
     * @param {Number} b Blue
     * @param {Number} a Alpha
     */
    constructor(r, g, b, a = 1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    toRGBString() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }

    toRGBAString() {
        return `rgb(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }

    /**
     * Generates random Color
     * @param {Number} minVal
     * @param {Number} maxVal
     * @param {Number} a
     * @returns {Color}
     */
    static random(minVal = 0, maxVal = 255, a = 1) {
        return new Color(
            getRandomInt(minVal, maxVal),
            getRandomInt(minVal, maxVal),
            getRandomInt(minVal, maxVal),
            a
        );
    }
}