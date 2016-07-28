import Control from './Control.js'

/**
 * Place where stars are displayed.
 */
export default class StarsHolder extends Control {
    constructor(node) {
        super(node);
        this._hiddenClass = 'stars-holder_inactive';
    }

    get node() {
        return this._node;
    }
}