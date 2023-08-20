"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineTimer = exports.colorRgbToHex = exports.colorHexToRgb = exports.turnDelayIsOver = void 0;
function turnDelayIsOver(timer) {
    return new Date().getTime() - timer >= 1000;
}
exports.turnDelayIsOver = turnDelayIsOver;
function colorHexToRgb(hexaColor) {
    const r = parseInt(hexaColor.slice(1, 3), 16);
    const g = parseInt(hexaColor.slice(3, 5), 16);
    const b = parseInt(hexaColor.slice(5, 7), 16);
    const rgb = { r, g, b, a: 1 };
    return rgb;
}
exports.colorHexToRgb = colorHexToRgb;
function colorRgbToHex(rgbColor) {
    const { r, g, b } = rgbColor;
    const hexaColor = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
    return hexaColor;
}
exports.colorRgbToHex = colorRgbToHex;
function defineTimer(second, reason, playerName) {
    return {
        end: new Date().getTime() + second * 1000,
        reason: reason,
        playerName: playerName,
    };
}
exports.defineTimer = defineTimer;
//# sourceMappingURL=pongUtils.js.map