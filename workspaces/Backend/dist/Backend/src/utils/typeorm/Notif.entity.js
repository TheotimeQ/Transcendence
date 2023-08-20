"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notif = void 0;
const typeorm_1 = require("typeorm");
const NotifMessages_entity_1 = require("./NotifMessages.entity");
let Notif = exports.Notif = class Notif {
    async nullChecks() {
        if (!this.notifMessages) {
            this.notifMessages = [];
        }
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Notif.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { array: true, default: {} }),
    __metadata("design:type", Array)
], Notif.prototype, "redPongies", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { array: true, default: {} }),
    __metadata("design:type", Array)
], Notif.prototype, "redChannels", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => NotifMessages_entity_1.NotifMessages, notifMessages => notifMessages.notif, {
        eager: true,
    }),
    __metadata("design:type", Array)
], Notif.prototype, "notifMessages", void 0);
__decorate([
    (0, typeorm_1.AfterLoad)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], Notif.prototype, "nullChecks", null);
exports.Notif = Notif = __decorate([
    (0, typeorm_1.Entity)()
], Notif);
//# sourceMappingURL=Notif.entity.js.map