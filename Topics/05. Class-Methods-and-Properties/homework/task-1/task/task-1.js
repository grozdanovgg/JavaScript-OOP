'use strict';

class listNode {
    constructor(value) {
        this._list = [];
        this._list.push(value);
    }
    get first() {
        return this._list[0];
    }
}

class LinkedList {
    constructor() {

    }
}

module.exports = LinkedList;