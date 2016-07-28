import ScoresControl from './controls/ScoresControl.js';
import MistakesControl from './controls/MistakesControl.js';
import SoundControl from './controls/SoundControl.js';
import Star from './controls/Star.js';
import MenuScreenStart from './controls/MenuScreenStart.js';
import MenuScreenEnd from './controls/MenuScreenEnd.js';
import StarsHolder from './controls/StarsHolder.js';

import sounds from './sounds.json';
import SoundEffects from './SoundEffects.js';

const BACKGROUND_STARS_NUMBER_FACTOR = 0.0004;
const HIDE_TIMEOUT = 800;
const NEW_STAR_EFFECT = 'newStar';
const WRONG_STAR_EFFECT = 'wrongStar';

class App {
    constructor() {

        this._mistakesControl = new MistakesControl(document.querySelector('.control_mistakes'));
        this._scoresControl = new ScoresControl(document.querySelector('.control_scores'));
        this._soundControl = new SoundControl(document.querySelector('.control_sound'));

        this._soundEffects = new SoundEffects(sounds, (songName) => this._soundControl.updateSongName(songName));
        this._soundControl.muteCallback = () => this._soundEffects.mute();

        this._stars = [];
        this._starsHolder = new StarsHolder(document.querySelector('.stars-holder'));
        const starsNumber = document.body.clientWidth * document.body.clientHeight * BACKGROUND_STARS_NUMBER_FACTOR;

        for (let i = 0; i <= starsNumber; i++) {
            this._addStar();
        }

        this._menuScreenStart = new MenuScreenStart(document.querySelector('.menu__screen_start'));
        this._menuScreenStart.startGameBtn.addEventListener('click', () => {
            this._startGame();
        });


        this._menuScreenEnd = new MenuScreenEnd(document.querySelector('.menu__screen_end-game'));
        this._menuScreenEnd.retryBtn.addEventListener('click', () => {
            this._startGame();
        });

        if (this._menuScreenEnd.shareBtn) {
            this._menuScreenEnd.shareBtn.addEventListener('click', () => {
                if (window.plugins && window.plugins.socialsharing) {
                    const options = {
                        message: `I have counted ${this._scoresControl.value} stars in Count The Stars Game!`,
                        subject: 'Count The Stars', // fi. for email
                        url: 'http://mad-gooze.github.io/CountTheStarsGame/'
                    };
                    window.plugins.socialsharing.shareWithOptions(options);
                }
            });
        }

        this._soundControl.show();
        this._menuScreenStart.show();
    };

    _addStar(clickable, soundEffect) {
        const star = Star.generateRandom();
        this._stars.push(star);
        star.addToDOM(this._starsHolder.node);
        setTimeout(star.show.bind(star), 100);
        //star.show();

        if (clickable) {
            star.addEventListener('click', () => {
                this._processStarClick(star)
            });
        }
        if (soundEffect) {
            this._soundEffects.playEffect(soundEffect);
        }
    }

    _processStarClick(star) {
        const index = this._stars.indexOf(star);
        if (index == this._stars.length - 1) {
            this._scoresControl.value++;
            this._addStar(true, NEW_STAR_EFFECT);
        } else {
            this._mistakesControl.value--;
            if (this._mistakesControl.value < 0) {
                this._endGame();
                this._soundEffects.playEffect(WRONG_STAR_EFFECT);
            } else {
                this._addStar(true, WRONG_STAR_EFFECT);
            }
        }

    }

    _endGame() {
        this._starsHolder.hide();
        this._mistakesControl.hide();
        this._scoresControl.hide();

        this._menuScreenEnd.show();
        this._menuScreenEnd.score = this._scoresControl.value;
    }

    _startGame() {
        this._menuScreenStart.hide();
        this._menuScreenEnd.hide();
        // remove drawn stars
        for (let star of this._stars) {
            star.hide();
        }
        setTimeout(() => {
            for (let star of this._stars) {
                star.remove();
            }
            this._stars = [];
            this._addStar(true, NEW_STAR_EFFECT); // add first star
        }, HIDE_TIMEOUT);

        // re-init in-game UI
        this._mistakesControl.dropValue();
        this._scoresControl.dropValue();
        this._mistakesControl.show();
        this._scoresControl.show();
        this._starsHolder.show();
    }
}

document.addEventListener("deviceready", onDeviceReady, false);

window.onload = onDeviceReady;


function onDeviceReady() {
    if (!window.deviceready) {
        window.deviceready = true;


        new App();
    }
}