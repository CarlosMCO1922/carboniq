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
exports.ActivitiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ActivitiesService = class ActivitiesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    list(projectId) {
        return this.prisma.activity.findMany({
            where: projectId ? { projectId } : undefined,
            include: { factor: true },
            orderBy: { createdAt: 'desc' }
        });
    }
    async create(dto) {
        const created = await this.prisma.activity.create({
            data: {
                projectId: dto.projectId,
                type: dto.type,
                amount: dto.amount,
                unit: dto.unit,
                location: dto.location,
                factorId: dto.factorId,
                periodFrom: dto.periodFrom ? new Date(dto.periodFrom) : undefined,
                periodTo: dto.periodTo ? new Date(dto.periodTo) : undefined,
                metadata: dto.metadata
            }
        });
        if (created.factorId) {
            const f = await this.prisma.emissionFactor.findUnique({ where: { id: created.factorId } });
            let rf = 1;
            try {
                const m = created.metadata;
                if (m && m.rfMultiplier && String(f?.code || '').startsWith('FLIGHT_'))
                    rf = Number(m.rfMultiplier) || 1;
            }
            catch { }
            const co2e = f ? created.amount * f.co2ePerUnit * rf : 0;
            await this.prisma.calculation.create({
                data: {
                    activityId: created.id,
                    factorId: f?.id,
                    method: f ? 'factor' : 'external',
                    co2e,
                    breakdown: { source: 'auto-on-create' }
                }
            });
        }
        return created;
    }
    get(id) {
        return this.prisma.activity.findUnique({ where: { id } });
    }
    update(id, dto) {
        return this.prisma.activity.update({ where: { id }, data: dto });
    }
    async duplicate(id) {
        const a = await this.prisma.activity.findUnique({ where: { id } });
        if (!a)
            throw new Error('Activity not found');
        const copy = await this.prisma.activity.create({
            data: {
                projectId: a.projectId,
                type: a.type,
                amount: a.amount,
                unit: a.unit,
                location: a.location || undefined,
                factorId: a.factorId || undefined,
                metadata: a.metadata
            }
        });
        return copy;
    }
    async remove(id) {
        await this.prisma.calculation.deleteMany({ where: { activityId: id } });
        return this.prisma.activity.delete({ where: { id } });
    }
};
exports.ActivitiesService = ActivitiesService;
exports.ActivitiesService = ActivitiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ActivitiesService);
//# sourceMappingURL=activities.service.js.map