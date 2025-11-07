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
exports.SpendService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
function parseCsv(text) {
    const lines = text.trim().split(/\r?\n/);
    const headers = lines.shift()?.split(',').map((s) => s.trim()) ?? [];
    return lines.map((l) => {
        const cols = l.split(',');
        const rec = {};
        headers.forEach((h, i) => (rec[h] = (cols[i] ?? '').trim()));
        return rec;
    });
}
let SpendService = class SpendService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    listMappings(projectId) {
        return this.prisma.spendMapping.findMany({ where: { projectId } });
    }
    upsertMapping(dto) {
        return this.prisma.spendMapping.upsert({
            where: { projectId_code: { projectId: dto.projectId, code: dto.code } },
            update: { factorId: dto.factorId, description: dto.description },
            create: dto
        });
    }
    async importCsv(projectId, csv) {
        const rows = parseCsv(csv);
        const created = [];
        for (const r of rows) {
            const exp = await this.prisma.expense.create({
                data: {
                    projectId,
                    date: new Date(r.date || Date.now()),
                    amount: Number(r.amount || 0),
                    currency: (r.currency || 'EUR').toUpperCase(),
                    category: r.category || 'UNMAPPED'
                }
            });
            created.push(exp);
        }
        return { count: created.length };
    }
    async compute(projectId) {
        const mappings = await this.prisma.spendMapping.findMany({ where: { projectId } });
        const mapByCode = new Map(mappings.map((m) => [m.code, m]));
        const expenses = await this.prisma.expense.findMany({ where: { projectId } });
        let created = 0;
        for (const e of expenses) {
            const mapping = mapByCode.get(e.category);
            if (!mapping)
                continue;
            const activity = await this.prisma.activity.create({
                data: {
                    projectId,
                    type: 'spend',
                    amount: e.amount,
                    unit: 'EUR',
                    metadata: { expenseId: e.id, category: e.category }
                }
            });
            const factor = await this.prisma.emissionFactor.findUnique({ where: { id: mapping.factorId } });
            const co2e = factor ? e.amount * factor.co2ePerUnit : 0;
            await this.prisma.calculation.create({
                data: {
                    activityId: activity.id,
                    factorId: factor?.id,
                    method: 'spend-based',
                    co2e,
                    breakdown: { source: 'mapping', mapping: mapping.code }
                }
            });
            created++;
        }
        return { created };
    }
};
exports.SpendService = SpendService;
exports.SpendService = SpendService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SpendService);
//# sourceMappingURL=spend.service.js.map