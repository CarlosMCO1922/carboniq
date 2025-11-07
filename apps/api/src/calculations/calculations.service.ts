import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma.service';

const DEFAULT_CALC_URL = process.env.CALC_URL || 'http://localhost:8001';

@Injectable()
export class CalculationsService {
  constructor(private readonly prisma: PrismaService) {}

  async compute(dto: {activityId: string; method?: string; factorId?: string}) {
    const activity = await this.prisma.activity.findUnique({where: {id: dto.activityId}});
    if (!activity) throw new Error('Activity not found');

    const factorId = dto.factorId ?? activity.factorId ?? undefined;
    let factor = undefined as undefined | {id: string; co2ePerUnit: number};
    if (factorId) {
      const f = await this.prisma.emissionFactor.findUnique({where: {id: factorId}});
      if (f) factor = {id: f.id, co2ePerUnit: f.co2ePerUnit};
    }

    // Placeholder: if factor exists, simple multiplication; else call calc service
    let co2e: number;
    let breakdown: any = undefined;

    if (factor) {
      co2e = activity.amount * factor.co2ePerUnit;
      breakdown = {source: 'local', factorId: factor.id};
    } else {
      const resp = await fetch(`${DEFAULT_CALC_URL}/health`).then((r) => r.json()).catch(() => ({status: 'down'}));
      co2e = 0;
      breakdown = {source: 'calc-service', health: resp.status};
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
}
