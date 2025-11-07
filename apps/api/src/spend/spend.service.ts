import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma.service';

function parseCsv(text: string): Array<Record<string, string>> {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift()?.split(',').map((s) => s.trim()) ?? [];
  return lines.map((l) => {
    const cols = l.split(',');
    const rec: Record<string, string> = {};
    headers.forEach((h, i) => (rec[h] = (cols[i] ?? '').trim()));
    return rec;
  });
}

@Injectable()
export class SpendService {
  constructor(private readonly prisma: PrismaService) {}

  listMappings(projectId: string) {
    return this.prisma.spendMapping.findMany({where: {projectId}});
  }

  upsertMapping(dto: {projectId: string; code: string; factorId: string; description?: string}) {
    return this.prisma.spendMapping.upsert({
      where: {projectId_code: {projectId: dto.projectId, code: dto.code}},
      update: {factorId: dto.factorId, description: dto.description},
      create: dto
    });
  }

  async importCsv(projectId: string, csv: string) {
    // Expected headers: date,amount,currency,category
    const rows = parseCsv(csv);
    const created = [] as any[];
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
    return {count: created.length};
  }

  async compute(projectId: string) {
    // For each expense with mapping, create Activity + Calculation (spend-based)
    const mappings = await this.prisma.spendMapping.findMany({where: {projectId}});
    const mapByCode = new Map(mappings.map((m) => [m.code, m] as const));

    const expenses = await this.prisma.expense.findMany({where: {projectId}});
    let created = 0;
    for (const e of expenses) {
      const mapping = mapByCode.get(e.category);
      if (!mapping) continue;
      const activity = await this.prisma.activity.create({
        data: {
          projectId,
          type: 'spend',
          amount: e.amount,
          unit: 'EUR',
          metadata: {expenseId: e.id, category: e.category}
        }
      });
      const factor = await this.prisma.emissionFactor.findUnique({where: {id: mapping.factorId}});
      const co2e = factor ? e.amount * factor.co2ePerUnit : 0;
      await this.prisma.calculation.create({
        data: {
          activityId: activity.id,
          factorId: factor?.id,
          method: 'spend-based',
          co2e,
          breakdown: {source: 'mapping', mapping: mapping.code}
        }
      });
      created++;
    }
    return {created};
  }
}
