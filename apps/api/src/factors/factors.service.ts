import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma.service';

@Injectable()
export class FactorsService {
  constructor(private readonly prisma: PrismaService) {}

  list(params: {region?: 'PT' | 'EU' | 'UK'; scope?: 'SCOPE1' | 'SCOPE2' | 'SCOPE3'}) {
    const {region, scope} = params;
    return this.prisma.emissionFactor.findMany({
      where: {
        region: region as any,
        scope: scope as any
      },
      orderBy: [{code: 'asc'}]
    });
  }

  search(params: {q?: string; region?: 'PT'|'EU'|'UK'; scope?: 'SCOPE1'|'SCOPE2'|'SCOPE3'; unit?: string; version?: string; limit?: number}) {
    const {q, region, scope, unit, version, limit} = params;
    return this.prisma.emissionFactor.findMany({
      where: {
        region: region as any,
        scope: scope as any,
        unit: unit || undefined,
        version: version || undefined,
        code: q ? {contains: q, mode: 'insensitive'} : undefined,
      },
      orderBy: [{version: 'desc'}, {code: 'asc'}],
      take: limit || 100
    });
  }

  async suggest(params: {region: 'PT' | 'EU' | 'UK'; type: string}) {
    // Map activity type -> constraints
    const t = params.type.toLowerCase();
    if (t.includes('electric')) {
      return this.prisma.emissionFactor.findFirst({where: {region: params.region as any, unit: 'kWh', scope: 'SCOPE2' as any}, orderBy: {version:'desc'}});
    }
    if (t.includes('diesel')) {
      return this.prisma.emissionFactor.findFirst({where: {region: params.region as any, code: {contains: 'DIESEL'}}, orderBy: {version:'desc'}});
    }
    if (t.includes('gasoline') || t.includes('petrol')) {
      return this.prisma.emissionFactor.findFirst({where: {region: params.region as any, code: {contains: 'GASOLINE'}}, orderBy: {version:'desc'}});
    }
    if (t.includes('natgas') || t.includes('natural') ) {
      return this.prisma.emissionFactor.findFirst({where: {region: params.region as any, code: {contains: 'NATGAS'}}, orderBy: {version:'desc'}});
    }
    if (t.includes('propane') || t.includes('butane') || t.includes('lpg')) {
      return this.prisma.emissionFactor.findFirst({where: {region: params.region as any, code: {contains: 'LPG'}}, orderBy: {version:'desc'}});
    }
    if (t.includes('saas') || t.includes('cloud')) {
      return this.prisma.emissionFactor.findFirst({where: {region: params.region as any, code: {contains: 'SAAS'}}, orderBy: {version:'desc'}});
    }
    if (t.includes('furniture')) {
      return this.prisma.emissionFactor.findFirst({where: {region: params.region as any, code: {contains: 'FURNITURE'}}, orderBy: {version:'desc'}});
    }
    if (t.includes('clean') || t.includes('cleaning')) {
      return this.prisma.emissionFactor.findFirst({where: {region: params.region as any, code: {contains: 'CLEANING'}}, orderBy: {version:'desc'}});
    }
    if (t.includes('maint') || t.includes('maintenance')) {
      return this.prisma.emissionFactor.findFirst({where: {region: params.region as any, code: {contains: 'MAINTENANCE'}}, orderBy: {version:'desc'}});
    }
    if (t.includes('train')) {
      return this.prisma.emissionFactor.findFirst({where: {region: params.region as any, code: {contains:'TRAIN'}}, orderBy: {version:'desc'}});
    }
    if (t.includes('flight') || t.includes('aviation')) {
      return this.prisma.emissionFactor.findFirst({where: {region: params.region as any, code: {contains:'FLIGHT'}}, orderBy: {version:'desc'}});
    }
    if (t.includes('marketing')) {
      return this.prisma.emissionFactor.findFirst({where: {code: {contains:'SPEND_MARKETING'}}, orderBy: {version:'desc'}});
    }
    if (t.includes('water')) {
      return this.prisma.emissionFactor.findFirst({where: {code: {contains:'WATER_'}}, orderBy: {version:'desc'}});
    }
    if (t.includes('wastewater') || t.includes('etar')) {
      return this.prisma.emissionFactor.findFirst({where: {code: {contains:'WASTEWATER_'}}, orderBy: {version:'desc'}});
    }
    if (t.includes('rf')) {
      return this.prisma.emissionFactor.findFirst({where: {region: params.region as any, code: {contains:'RF_MULT'}}, orderBy: {version:'desc'}});
    }
    if (t.includes('ship') || t.includes('boat')) {
      return this.prisma.emissionFactor.findFirst({where: {region: params.region as any, code: {contains:'SHIP'}}, orderBy: {version:'desc'}});
    }
    if (t.includes('transport') || t.includes('km')) {
      return this.prisma.emissionFactor.findFirst({where: {region: params.region as any, unit: 'km', scope: 'SCOPE3' as any}, orderBy: {version:'desc'}});
    }
    // fallback generic by region
    return this.prisma.emissionFactor.findFirst({where: {region: params.region as any}, orderBy: {version:'desc'}});
  }
}
