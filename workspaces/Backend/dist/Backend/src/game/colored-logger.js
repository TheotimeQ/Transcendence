"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColoredLogger = void 0;
const common_1 = require("@nestjs/common");
let ColoredLogger = exports.ColoredLogger = class ColoredLogger extends common_1.Logger {
    getColorPrefix(color, context) {
        const reset = '\x1b[0m';
        return `${color}[GAME gateway] (${context}): ${reset}`;
    }
    log(message, context) {
        const blue = '\x1b[34m';
        process.stdout.write(this.getColorPrefix(blue, context) + ' ' + message + '\n');
    }
    error(message, context, trace) {
        const red = '\x1b[31m';
        process.stderr.write(this.getColorPrefix(red, context) + ' ' + message + '\n');
        if (trace) {
            process.stderr.write(trace + '\n');
        }
    }
    warn(message, context) {
        const yellow = '\x1b[33m';
        process.stdout.write(this.getColorPrefix(yellow, context) + ' ' + message + '\n');
    }
};
exports.ColoredLogger = ColoredLogger = __decorate([
    (0, common_1.Injectable)()
], ColoredLogger);
//# sourceMappingURL=colored-logger.js.map