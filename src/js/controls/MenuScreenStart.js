import MenuScreen from './MenuScreen.js';

/**
 * Screen of game end menu.
 */
export default class MenuScreenStart extends MenuScreen {
    constructor(node) {
        super(node);
        this.startGameBtn = this._node.querySelector('.menu__btn_start-game');
    }
}

