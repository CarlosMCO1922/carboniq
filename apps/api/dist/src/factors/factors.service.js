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
exports.FactorsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let FactorsService = class FactorsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    list(params) {
        const { region, scope } = params;
        return this.prisma.emissionFactor.findMany({
            where: {
                region: region,
                scope: scope
            },
            orderBy: [{ code: 'asc' }]
        });
    }
    search(params) {
        const { q, region, scope, unit, version, limit } = params;
        return this.prisma.emissionFactor.findMany({
            where: {
                region: region,
                scope: scope,
                unit: unit || undefined,
                version: version || undefined,
                code: q ? { contains: q, mode: 'insensitive' } : undefined,
            },
            orderBy: [{ version: 'desc' }, { code: 'asc' }],
            take: limit || 100
        });
    }
    async suggest(params) {
        const t = params.type.toLowerCase();
        if (t.includes('electric')) {
            return this.prisma.emissionFactor.findFirst({ where: { region: params.region, unit: 'kWh', scope: 'SCOPE2' }, orderBy: { version: 'desc' } });
        }
        if (t.includes('diesel')) {
            return this.prisma.emissionFactor.findFirst({ where: { region: params.region, code: { contains: 'DIESEL' } }, orderBy: { version: 'desc' } });
        }
        if (t.includes('gasoline') || t.includes('petrol')) {
            return this.prisma.emissionFactor.findFirst({ where: { region: params.region, code: { contains: 'GASOLINE' } }, orderBy: { version: 'desc' } });
        }
        if (t.includes('natgas') || t.includes('natural')) {
            return this.prisma.emissionFactor.findFirst({ where: { region: params.region, code: { contains: 'NATGAS' } }, orderBy: { version: 'desc' } });
        }
        if (t.includes('propane') || t.includes('butane') || t.includes('lpg')) {
            return this.prisma.emissionFactor.findFirst({ where: { region: params.region, code: { contains: 'LPG' } }, orderBy: { version: 'desc' } });
        }
        if (t.includes('saas') || t.includes('cloud')) {
            return this.prisma.emissionFactor.findFirst({ where: { region: params.region, code: { contains: 'SAAS' } }, orderBy: { version: 'desc' } });
        }
        if (t.includes('furniture')) {
            return this.prisma.emissionFactor.findFirst({ where: { region: params.region, code: { contains: 'FURNITURE' } }, orderBy: { version: 'desc' } });
        }
        if (t.includes('clean') || t.includes('cleaning')) {
            return this.prisma.emissionFactor.findFirst({ where: { region: params.region, code: { contains: 'CLEANING' } }, orderBy: { version: 'desc' } });
        }
        if (t.includes('maint') || t.includes('maintenance')) {
            return this.prisma.emissionFactor.findFirst({ where: { region: params.region, code: { contains: 'MAINTENANCE' } }, orderBy: { version: 'desc' } });
        }
        if (t.includes('train')) {
            return this.prisma.emissionFactor.findFirst({ where: { region: params.region, code: { contains: 'TRAIN' } }, orderBy: { version: 'desc' } });
        }
        if (t.includes('flight') || t.includes('aviation')) {
            return this.prisma.emissionFactor.findFirst({ where: { region: params.region, code: { contains: 'FLIGHT' } }, orderBy: { version: 'desc' } });
        }
        if (t.includes('marketing')) {
            return this.prisma.emissionFactor.findFirst({ where: { code: { contains: 'SPEND_MARKETING' } }, orderBy: { version: 'desc' } });
        }
        if (t.includes('water')) {
            return this.prisma.emissionFactor.findFirst({ where: { code: { contains: 'WATER_' } }, orderBy: { version: 'desc' } });
        }
        if (t.includes('wastewater') || t.includes('etar')) {
            return this.prisma.emissionFactor.findFirst({ where: { code: { contains: 'WASTEWATER_' } }, orderBy: { version: 'desc' } });
        }
        if (t.includes('rf')) {
            return this.prisma.emissionFactor.findFirst({ where: { region: params.region, code: { contains: 'RF_MULT' } }, orderBy: { version: 'desc' } });
        }
        if (t.includes('ship') || t.includes('boat')) {
            return this.prisma.emissionFactor.findFirst({ where: { region: params.region, code: { contains: 'SHIP' } }, orderBy: { version: 'desc' } });
        }
        if (t.includes('transport') || t.includes('km')) {
            return this.prisma.emissionFactor.findFirst({ where: { region: params.region, unit: 'km', scope: 'SCOPE3' }, orderBy: { version: 'desc' } });
        }
        return this.prisma.emissionFactor.findFirst({ where: { region: params.region }, orderBy: { version: 'desc' } });
    }
};
exports.FactorsService = FactorsService;
exports.FactorsService = FactorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FactorsService);
//# sourceMappingURL=factors.service.js.map