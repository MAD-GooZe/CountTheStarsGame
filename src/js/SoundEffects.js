import {getRandomInt} from './Utils.js';

const nop = () => {};

/**
 * Plays various sound effects via HTML5 Audio or Phongap cordova-plugin-nativeaudio
 */
export default class SoundEffects {
    constructor(sounds, nextTrackCallback) {
        this._nextTrackCallback = nextTrackCallback;
        this._sounds = sounds;
        this._mute = false;

        this._lastEffectNumbers = {}; // previously played effects

        this._native = window.plugins && window.plugins.NativeAudio;

        if (this._native) {

            for (let effect in sounds.effects) {
                for (let file in sounds.effects[effect]) {
                    const url = this._sounds.path + sounds.effects[effect][file];
                    window.plugins.NativeAudio.preloadSimple(url, url);
                }
            }

            this._nativeMusicIds = [];
            for (let track in sounds.music) {
                const url = this._sounds.path + sounds.music[track].file;
                window.plugins.NativeAudio.preloadComplex(url, url, 1, 1, 0, () => {
                    this._nativeMusicIds.push(url);
                    this._trackLoadCallback();
                });

            }
        } else {
            this._players = {}; // audio objects playing effects saved here
            this._musicPlayer = new Audio();
            this._musicPlayer.addEventListener('ended', () => this._nextTrack());
            this._nextTrack();
        }

        this._prevTrackNumber = -1;
    }


    _trackLoadCallback() {
        if (this._nativeMusicIds.length === this._sounds.music.length) {
            this._nextTrack();
        }
    }

    _randomTrackNumber() {
        return getRandomInt(0, this._sounds.music.length - 1);
    }

    _nextTrack() {
        let nextTrackNumber;
        do {
            nextTrackNumber = this._randomTrackNumber();
        } while (nextTrackNumber === this._prevTrackNumber); // get random track (different from previous)

        const url = this._sounds.path + this._sounds.music[nextTrackNumber].file;
        this._prevTrackNumber = nextTrackNumber;

        if (this._native) {
            window.plugins.NativeAudio.play(url, nop, nop, () => {this._nextTrack()});
        } else {
            this._musicPlayer.src = url;
            this._musicPlayer.play();
        }

        this._nextTrackCallback(this._sounds.music[nextTrackNumber].name);
    }


    _playSound(url) {
        if (!this._mute) {
            if (this._native) {
                window.plugins.NativeAudio.play(this._sounds.path + url);
            } else {
                const id = Date.now();
                this._players[id] = new Audio();
                this._players[id].src = this._sounds.path + url;
                this._players[id].addEventListener('ended', () => delete this._players[id]);
                this._players[id].play();
            }
        }
    }


    playEffect(effectName) {
        // sounds of the effects are cycled
        let effectNumber = this._lastEffectNumbers[effectName]; // get previously played sound number for this effect
        if (!Number.isInteger(effectNumber)) {
            effectNumber = -1;
        }

        effectNumber = (effectNumber + 1) % this._sounds.effects[effectName].length; // get next sound number
        this._playSound(this._sounds.effects[effectName][effectNumber]);
        this._lastEffectNumbers[effectName] = effectNumber;
    }

    mute() {
        this._mute = !this._mute;
        if (this._native) {
            for (let id of this._nativeMusicIds) {
                window.plugins.NativeAudio.setVolumeForComplexAsset(id, this._mute ? 0 : 1);
            }
        } else {
            this._musicPlayer.muted = this._mute;
            for (let playerId in this._players) {
                this._players[playerId].muted = this._mute;
            }
        }
    }
}