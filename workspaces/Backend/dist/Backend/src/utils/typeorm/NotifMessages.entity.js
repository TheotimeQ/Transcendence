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
exports.NotifMessages = void 0;
const typeorm_1 = require("typeorm");
const Notif_entity_1 = require("./Notif.entity");
let NotifMessages = exports.NotifMessages = class NotifMessages {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], NotifMessages.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], NotifMessages.prototype, "channelId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], NotifMessages.prototype, "nbMessages", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Notif_entity_1.Notif, notif => notif.notifMessages),
    __metadata("design:type", Notif_entity_1.Notif)
], NotifMessages.prototype, "notif", void 0);
exports.NotifMessages = NotifMessages = __decorate([
    (0, typeorm_1.Entity)()
], NotifMessages);
//# sourceMappingURL=NotifMessages.entity.js.map