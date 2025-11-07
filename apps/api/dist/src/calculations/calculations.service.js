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
exports.CalculationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const DEFAULT_CALC_URL = process.env.CALC_URL || 'http://localhost:8001';
let CalculationsService = class CalculationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async compute(dto) {
        const activity = await this.prisma.activity.findUnique({ where: { id: dto.activityId } });
        if (!activity)
            throw new Error('Activity not found');
        const factorId = dto.factorId ?? activity.factorId ?? undefined;
        let factor = undefined;
        if (factorId) {
            const f = await this.prisma.emissionFactor.findUnique({ where: { id: factorId } });
            if (f)
                factor = { id: f.id, co2ePerUnit: f.co2ePerUnit };
        }
        let co2e;
        let breakdown = undefined;
        if (factor) {
            co2e = activity.amount * factor.co2ePerUnit;
            breakdown = { source: 'local', factorId: factor.id };
        }
        else {
            const resp = await fetch(`${DEFAULT_CALC_URL}/health`).then((r) => r.json()).catch(() => ({ status: 'down' }));
            co2e = 0;
            breakdown = { source: 'calc-service', health: resp.status };
        }
        const saved = await this.prisma.calculation.create({
            data: {
                activityId: activity.id,
                factorId: factor?.id,
                method: dto.method ?? (factor ? 'factor' : 'external'),
                co2e,
                breakdown
            }
        });
        return saved;
    }
};
exports.CalculationsService = CalculationsService;
exports.CalculationsService = CalculationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CalculationsService);
//# sourceMappingURL=calculations.service.js.map