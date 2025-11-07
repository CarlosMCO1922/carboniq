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
exports.FactorsController = void 0;
const common_1 = require("@nestjs/common");
const factors_service_1 = require("./factors.service");
let FactorsController = class FactorsController {
    factors;
    constructor(factors) {
        this.factors = factors;
    }
    list(region, scope) {
        return this.factors.list({ region, scope });
    }
    search(q, region, scope, unit, version, limit) {
        const take = limit ? Number(limit) : undefined;
        return this.factors.search({ q, region, scope, unit, version, limit: take });
    }
    suggest(region, type) {
        return this.factors.suggest({ region, type });
    }
};
exports.FactorsController = FactorsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('region')),
    __param(1, (0, common_1.Query)('scope')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FactorsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('q')),
    __param(1, (0, common_1.Query)('region')),
    __param(2, (0, common_1.Query)('scope')),
    __param(3, (0, common_1.Query)('unit')),
    __param(4, (0, common_1.Query)('version')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], FactorsController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('suggest'),
    __param(0, (0, common_1.Query)('region')),
    __param(1, (0, common_1.Query)('type')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], FactorsController.prototype, "suggest", null);
exports.FactorsController = FactorsController = __decorate([
    (0, common_1.Controller)('factors'),
    __metadata("design:paramtypes", [factors_service_1.FactorsService])
], FactorsController);
//# sourceMappingURL=factors.controller.js.map