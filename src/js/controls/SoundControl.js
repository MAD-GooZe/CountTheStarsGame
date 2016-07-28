import Control from './Control.js'

/**
 * Represents Sound Control
 */
export default class SoundControl extends Control {
    constructor(node) {
        super(node);

        this.muteCallback = undefined;
        this._songName = node.querySelector('.control__text_song-name');
        this._muteBtn = node.querySelector('.control__btn');
        this._muteBtn.addEventListener('click', () => {
            this._muteBtn.classList.toggle('icon-volume-high');
            this._muteBtn.classList.toggle('icon-volume-off');
            this.muteCallback();
        })
    }

    /**
     * Update displaying song name.
     * @param {String} name
     */
    updateSongName(name) {
        this._songName.innerHTML = name;
    }
}