import Control from './Control.js'

/**
 * Represents screen of menu.
 */
export default class MenuScreen extends Control {
    constructor(node) {
        super(node);
        this._hiddenClass = 'menu__screen_inactive';
    }
}