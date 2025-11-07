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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let ProjectsService = class ProjectsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    list(organizationId) {
        return this.prisma.project.findMany({
            where: organizationId ? { organizationId } : undefined,
            orderBy: { createdAt: 'desc' }
        });
    }
    create(dto) {
        return this.prisma.project.create({ data: dto });
    }
    get(id) {
        return this.prisma.project.findUnique({ where: { id } });
    }
    async summary(projectId, from, to) {
        const fromDate = from ? new Date(from) : undefined;
        const toDate = to ? new Date(to) : undefined;
        const calcs = await this.prisma.calculation.findMany({
            where: {
                activity: { projectId },
                createdAt: {
                    gte: fromDate,
                    lte: toDate
                }
            },
            include: {
                factor: true
            }
        });
        const total = calcs.reduce((s, c) => s + (c.co2e || 0), 0);
        const byScope = { SCOPE1: 0, SCOPE2: 0, SCOPE3: 0 };
        for (const c of calcs) {
            const scope = c.factor?.scope || 'SCOPE2';
            byScope[scope] += c.co2e || 0;
        }
        return {
            projectId,
            period: { from: fromDate ?? null, to: toDate ?? null },
            totals: { co2e: total, byScope }
        };
    }
    async exportCsv(projectId) {
        const rows = await this.prisma.calculation.findMany({
            where: { activity: { projectId } },
            include: {
                activity: true,
                factor: true
            },
            orderBy: { createdAt: 'desc' }
        });
        const header = [
            'calculation_id',
            'activity_id',
            'type',
            'amount',
            'unit',
            'factor_code',
            'scope',
            'co2e',
            'created_at'
        ];
        const lines = [header.join(',')];
        for (const r of rows) {
            lines.push([
                r.id,
                r.activityId,
                r.activity.type,
                r.activity.amount,
                r.activity.unit,
                r.factor?.code ?? '',
                r.factor?.scope ?? '',
                r.co2e,
                r.createdAt.toISOString()
            ].join(','));
        }
        return { filename: `project-${projectId}-export.csv`, content: lines.join('\n') };
    }
    async exportJson(projectId) {
        const rows = await this.prisma.calculation.findMany({
            where: { activity: { projectId } },
            include: { activity: true, factor: true },
            orderBy: { createdAt: 'desc' }
        });
        return rows.map(r => ({
            id: r.id,
            activityId: r.activityId,
            type: r.activity.type,
            amount: r.activity.amount,
            unit: r.activity.unit,
            factor_code: r.factor?.code ?? null,
            scope: r.factor?.scope ?? null,
            co2e: r.co2e,
            created_at: r.createdAt
        }));
    }
    async calculateAll(projectId) {
        const activities = await this.prisma.activity.findMany({ where: { projectId } });
        return this.calculateBulk(projectId, activities.map(a => a.id));
    }
    async calculateBulk(projectId, activityIds) {
        const activities = await this.prisma.activity.findMany({ where: { projectId, id: { in: activityIds } } });
        let count = 0;
        for (const a of activities) {
            const factor = a.factorId ? await this.prisma.emissionFactor.findUnique({ where: { id: a.factorId } }) : null;
            const co2e = factor ? a.amount * factor.co2ePerUnit : 0;
            await this.prisma.calculation.create({
                data: {
                    activityId: a.id,
                    factorId: factor?.id,
                    method: factor ? 'factor' : 'external',
                    co2e,
                    breakdown: { source: factor ? 'local' : 'external' }
                }
            });
            count++;
        }
        return { count };
    }
    async results(projectId, from, to) {
        const fromDate = from ? new Date(from) : undefined;
        const toDate = to ? new Date(to) : undefined;
        const rows = await this.prisma.calculation.findMany({
            where: {
                activity: { projectId },
                createdAt: { gte: fromDate, lte: toDate }
            },
            include: { activity: true, factor: true }
        });
        const byScope = { SCOPE1: 0, SCOPE2: 0, SCOPE3: 0 };
        const byType = {};
        const byMonth = {};
        for (const r of rows) {
            const scope = r.factor?.scope || 'SCOPE2';
            byScope[scope] += r.co2e || 0;
            const type = r.activity.type;
            byType[type] = (byType[type] || 0) + (r.co2e || 0);
            const k = r.createdAt.toISOString().slice(0, 7);
            byMonth[k] = (byMonth[k] || 0) + (r.co2e || 0);
        }
        const total = Object.values(byScope).reduce((a, b) => a + b, 0);
        return { total, byScope, byType, byMonth };
    }
    async computeSpend(projectId) {
        const expenses = await this.prisma.expense.findMany({ where: { projectId } });
        if (expenses.length === 0)
            return { created: 0 };
        return { notice: 'Use POST /spend/compute {projectId} to compute spend-based calculations' };
    }
    async remove(id) {
        await this.prisma.calculation.deleteMany({ where: { activity: { projectId: id } } });
        await this.prisma.activity.deleteMany({ where: { projectId: id } });
        await this.prisma.expense.deleteMany({ where: { projectId: id } });
        await this.prisma.spendMapping.deleteMany({ where: { projectId: id } });
        return this.prisma.project.delete({ where: { id } });
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map