import CounterControl from './CounterControl.js'

const ALLOWED_MISTAKES = 3;

/**
 * Control for displaying of how many mistakes left
 */
export default class MistakesControl extends CounterControl {
    /**
     * Initialize MistakesControl with specified HTML node
     * @param {HTMLElement} node
     */
    constructor(node) {
        super(node, ALLOWED_MISTAKES);
        this._starIcons = [];

        for (let i = 0; i < this._defaultValue; i++) {
            const icon = document.createElement('div');
            icon.classList.add('control__star-icon');
            this._starIcons.push(icon);
            this._node.appendChild(icon);
        }
    }

    get value() {
        return super.value;
    }

    set value(val) {
        val = Math.min(this._defaultValue, val);

        super.value = val;

        // show star icons from 0 to counter - 1, hide the others
        for (let i = 0; i < this.value; i++) {
            this._starIcons[i].style.opacity = 1;
        }
        for (let i = Math.max(this.value, 0); i < this._defaultValue; i++) {
            this._starIcons[i].style.opacity = 0;
        }
    }
}