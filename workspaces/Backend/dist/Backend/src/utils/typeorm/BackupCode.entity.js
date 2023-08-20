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
exports.BackupCode = void 0;
const typeorm_1 = require("typeorm");
const User_entity_1 = require("./User.entity");
let BackupCode = exports.BackupCode = class BackupCode {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BackupCode.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BackupCode.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_entity_1.User, user => user.backupCodes),
    __metadata("design:type", User_entity_1.User)
], BackupCode.prototype, "user", void 0);
exports.BackupCode = BackupCode = __decorate([
    (0, typeorm_1.Entity)()
], BackupCode);
//# sourceMappingURL=BackupCode.entity.js.map