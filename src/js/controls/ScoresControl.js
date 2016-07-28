import CounterControl from './CounterControl.js'

/**
 * Represents abstract Control with some counter
 */
export default class  extends CounterControl {
    constructor(node) {
        super(node, 0);
        this._countNode = this._node.querySelector('.control__count');
    }
    get value() {
        return super.value;
    }
    set value(val) {
        super.value = val;
        this._countNode.innerHTML = val;
    }
}
