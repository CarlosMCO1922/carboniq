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
exports.SpendController = void 0;
const common_1 = require("@nestjs/common");
const spend_service_1 = require("./spend.service");
let SpendController = class SpendController {
    spend;
    constructor(spend) {
        this.spend = spend;
    }
    listMappings(projectId) {
        return this.spend.listMappings(projectId);
    }
    upsertMapping(dto) {
        return this.spend.upsertMapping(dto);
    }
    async importCsv(projectId, req) {
        const raw = req.rawBody?.toString('utf8') ?? '';
        return this.spend.importCsv(projectId, raw);
    }
    compute(dto) {
        return this.spend.compute(dto.projectId);
    }
};
exports.SpendController = SpendController;
__decorate([
    (0, common_1.Get)('mappings'),
    __param(0, (0, common_1.Query)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SpendController.prototype, "listMappings", null);
__decorate([
    (0, common_1.Post)('mappings'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SpendController.prototype, "upsertMapping", null);
__decorate([
    (0, common_1.Post)('import.csv'),
    __param(0, (0, common_1.Query)('projectId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SpendController.prototype, "importCsv", null);
__decorate([
    (0, common_1.Post)('compute'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SpendController.prototype, "compute", null);
exports.SpendController = SpendController = __decorate([
    (0, common_1.Controller)('spend'),
    __metadata("design:paramtypes", [spend_service_1.SpendService])
], SpendController);
//# sourceMappingURL=spend.controller.js.map