import MenuScreen from './MenuScreen.js';

/**
 * Screen of game end menu.
 */
export default class MenuScreenEnd extends MenuScreen {
    constructor(node) {
        super(node);
        this.retryBtn = this._node.querySelector('.menu__btn_retry');
        this.shareBtn = this._node.querySelector('.menu__btn_share');
        this._textScore = this._node.querySelector('.menu__text_score');
        this._textPlural = this._node.querySelector('.menu__text_plural');
    }

    set score(score) {
        this._textScore.innerHTML = score;
        if (score == 1) {
            this._textPlural.style.display = 'none';
        } else {
            this._textPlural.style.display = 'inline';
        }
    }
}

