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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingController = void 0;
const common_1 = require("@nestjs/common");
const training_service_1 = require("../service/training.service");
const public_decorator_1 = require("../../utils/decorators/public.decorator");
const common_2 = require("@nestjs/common");
const CreateTraining_dto_1 = require("../dto/CreateTraining.dto");
const UpdateTraining_dto_1 = require("../dto/UpdateTraining.dto");
let TrainingController = exports.TrainingController = class TrainingController {
    constructor(trainingService) {
        this.trainingService = trainingService;
    }
    Status() {
        return 'Working !';
    }
    CreateTraining(training) {
        return this.trainingService.createTraining(training);
    }
    GetTrainingData(id, req) {
        return this.trainingService.getTrainingById(id, req.user.id);
    }
    IsInTraining(req) {
        return this.trainingService.isInTraining(req.user.id);
    }
    UpdateGame(id, req, training) {
        return this.trainingService.updateTraining(id, req.user.id, training);
    }
    QuitTraining(id, req) {
        return this.trainingService.quitTraining(id, req.user.id);
    }
};
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_2.Get)('status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "Status", null);
__decorate([
    (0, common_2.Post)('create'),
    (0, common_2.UsePipes)(new common_2.ValidationPipe({ transform: true })),
    __param(0, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateTraining_dto_1.CreateTrainingDTO]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "CreateTraining", null);
__decorate([
    (0, common_2.Get)('get/:id'),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, common_2.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "GetTrainingData", null);
__decorate([
    (0, common_2.Get)('isInTraining'),
    __param(0, (0, common_2.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "IsInTraining", null);
__decorate([
    (0, common_2.Put)('update/:id'),
    (0, common_2.UsePipes)(new common_2.ValidationPipe({ transform: true })),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, common_2.Req)()),
    __param(2, (0, common_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, UpdateTraining_dto_1.UpdateTrainingDTO]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "UpdateGame", null);
__decorate([
    (0, common_2.Post)('quit/:id'),
    __param(0, (0, common_2.Param)('id')),
    __param(1, (0, common_2.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "QuitTraining", null);
exports.TrainingController = TrainingController = __decorate([
    (0, common_1.Controller)('training'),
    __metadata("design:paramtypes", [training_service_1.TrainingService])
], TrainingController);
//# sourceMappingURL=training.controller.js.map