"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterBadWords = void 0;
function filterBadWords(text) {
    if (text === null || text.trim() === '')
        return '';
    else if (!/\w/.test(text))
        return text;
    else {
        var Filter = require('bad-words');
        var filter = new Filter();
        return filter.clean(text);
    }
}
exports.filterBadWords = filterBadWords;
//# sourceMappingURL=filterBadWords.js.map