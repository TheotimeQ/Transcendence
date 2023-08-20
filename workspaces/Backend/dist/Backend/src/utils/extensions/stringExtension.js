"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filterBadWords_1 = require("../badwords/filterBadWords");
String.prototype.filterBadWords = function () {
    return (0, filterBadWords_1.filterBadWords)(this);
};
//# sourceMappingURL=stringExtension.js.map