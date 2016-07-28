/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * @param {Number} min
 * @param {Number} max
 * @returns {Number}
 */
export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}