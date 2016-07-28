/**
 * Represents Game UI Control.
 */
export default class Control {
    /**
     * Initialize Control with specified HTML node.
     * @param {HTMLElement} node
     */
    constructor(node) {
        this._node = node;

        this.addEventListener = this._node.addEventListener.bind(this._node); // expose node's addEventListener
        this._hiddenClass = 'control_hidden';
    }

    /**
     * Show control.
     */
    show() {
        this._node.classList.remove(this._hiddenClass);
    }

    /**
     * Hide control.
     */
    hide() {
        this._node.classList.add(this._hiddenClass);
    }

    /**
     * Add Control to specified parent.
     * @param {HTMLElement} parent
     */
    addToDOM(parent) {
        parent.appendChild(this._node);
    }

    /**
     * Remove Control from DOM.
     */
    remove() {
        this._node.remove();
    }
}