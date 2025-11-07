import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  list(organizationId?: string) {
    return this.prisma.project.findMany({
      where: organizationId ? {organizationId} : undefined,
      orderBy: {createdAt: 'desc'}
    });
  }

  create(dto: {organizationId: string; name: string; region: 'PT' | 'EU' | 'UK'; currency?: string; locale?: string}) {
    return this.prisma.project.create({data: dto});
  }

  get(id: string) {
    return this.prisma.project.findUnique({where: {id}});
  }

  async summary(projectId: string, from?: string, to?: string) {
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    const calcs = await this.prisma.calculation.findMany({
      where: {
        activity: {projectId},
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
    const byScope: Record<'SCOPE1' | 'SCOPE2' | 'SCOPE3', number> = {SCOPE1: 0, SCOPE2: 0, SCOPE3: 0};
    for (const c of calcs) {
      const scope = (c.factor?.scope as 'SCOPE1' | 'SCOPE2' | 'SCOPE3') || 'SCOPE2';
      byScope[scope] += c.co2e || 0;
    }

    return {
      projectId,
      period: {from: fromDate ?? null, to: toDate ?? null},
      totals: {co2e: total, byScope}
    };
  }

  async exportCsv(projectId: string) {
    const rows = await this.prisma.calculation.findMany({
      where: {activity: {projectId}},
      include: {
        activity: true,
        factor: true
      },
      orderBy: {createdAt: 'desc'}
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

    return {filename: `project-${projectId}-export.csv`, content: lines.join('\n')};
  }

  async exportJson(projectId: string) {
    const rows = await this.prisma.calculation.findMany({
      where: {activity: {projectId}},
      include: {activity: true, factor: true},
      orderBy: {createdAt: 'desc'}
    });
    return rows.map(r=>({
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

  async calculateAll(projectId: string) {
    const activities = await this.prisma.activity.findMany({where: {projectId}});
    return this.calculateBulk(projectId, activities.map(a=>a.id));
  }

  async calculateBulk(projectId: string, activityIds: string[]) {
    const activities = await this.prisma.activity.findMany({where: {projectId, id: {in: activityIds}}});
    let count = 0;
    for (const a of activities) {
      const factor = a.factorId ? await this.prisma.emissionFactor.findUnique({where: {id: a.factorId}}) : null;
      const co2e = factor ? a.amount * factor.co2ePerUnit : 0;
      await this.prisma.calculation.create({
        data: {
          activityId: a.id,
          factorId: factor?.id,
          method: factor ? 'factor' : 'external',
          co2e,
          breakdown: {source: factor ? 'local' : 'external'}
        }
      });
      count++;
    }
    return {count};
  }

  async results(projectId: string, from?: string, to?: string) {
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    const rows = await this.prisma.calculation.findMany({
      where: {
        activity: {projectId},
        createdAt: {gte: fromDate, lte: toDate}
      },
      include: {activity: true, factor: true}
    });

    const byScope: Record<'SCOPE1'|'SCOPE2'|'SCOPE3', number> = {SCOPE1:0,SCOPE2:0,SCOPE3:0};
    const byType: Record<string, number> = {};
    const byMonth: Record<string, number> = {};

    for (const r of rows) {
      const scope = (r.factor?.scope as 'SCOPE1'|'SCOPE2'|'SCOPE3') || 'SCOPE2';
      byScope[scope] += r.co2e || 0;
      const type = r.activity.type;
      byType[type] = (byType[type] || 0) + (r.co2e || 0);
      const k = r.createdAt.toISOString().slice(0,7); // YYYY-MM
      byMonth[k] = (byMonth[k] || 0) + (r.co2e || 0);
    }

    const total = Object.values(byScope).reduce((a,b)=>a+b,0);
    return {total, byScope, byType, byMonth};
  }

  async computeSpend(projectId: string) {
    // delegate to SpendService via prisma directly
    const expenses = await this.prisma.expense.findMany({where:{projectId}});
    if (expenses.length === 0) return {created: 0};
    // naive delegation: create mapping table and calculations similar to SpendService (or call it via controller)
    // For simplicity, reuse SpendService logic through direct call is not available here; recommend using /spend/compute from frontend
    return {notice: 'Use POST /spend/compute {projectId} to compute spend-based calculations'};
  }

  async remove(id: string) {
    // Cascade delete related data
    await this.prisma.calculation.deleteMany({ where: { activity: { projectId: id } } });
    await this.prisma.activity.deleteMany({ where: { projectId: id } });
    await this.prisma.expense.deleteMany({ where: { projectId: id } });
    await this.prisma.spendMapping.deleteMany({ where: { projectId: id } });
    return this.prisma.project.delete({ where: { id } });
  }
}
