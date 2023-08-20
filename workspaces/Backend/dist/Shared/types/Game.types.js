"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirYValues = exports.DirXValues = exports.Action = void 0;
var Action;
(function (Action) {
    Action["Idle"] = "Idle";
    Action["Up"] = "Up";
    Action["Down"] = "Down";
    Action["Left"] = "Left";
    Action["Right"] = "Right";
    Action["Push"] = "Push";
    Action["Stop"] = "Stop";
})(Action || (exports.Action = Action = {}));
exports.DirXValues = {
    Left: -1,
    Idle: 0,
    Right: 1,
};
exports.DirYValues = {
    Up: -1,
    Idle: 0,
    Down: 1,
};
//# sourceMappingURL=Game.types.js.map