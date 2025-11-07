import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma.service';
import {Prisma} from '@prisma/client';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  list(projectId?: string) {
    return this.prisma.activity.findMany({
      where: projectId ? {projectId} : undefined,
      include: { factor: true },
      orderBy: {createdAt: 'desc'}
    });
  }

  async create(dto: {
    projectId: string;
    type: string;
    amount: number;
    unit: string;
    location?: string;
    periodFrom?: string;
    periodTo?: string;
    factorId?: string;
    metadata?: Record<string, unknown>;
  }) {
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
        metadata: dto.metadata as unknown as Prisma.InputJsonValue
      }
    });

    // Auto-calculate if factor present
    if (created.factorId) {
      const f = await this.prisma.emissionFactor.findUnique({where: {id: created.factorId}});
      let rf = 1;
      try {
        const m = created.metadata as any;
        if (m && m.rfMultiplier && String(f?.code||'').startsWith('FLIGHT_')) rf = Number(m.rfMultiplier) || 1;
      } catch {}
      const co2e = f ? created.amount * f.co2ePerUnit * rf : 0;
      await this.prisma.calculation.create({
        data: {
          activityId: created.id,
          factorId: f?.id,
          method: f ? 'factor' : 'external',
          co2e,
          breakdown: {source: 'auto-on-create'}
        }
      });
    }

    return created;
  }

  get(id: string) {
    return this.prisma.activity.findUnique({where: {id}});
  }

  update(id: string, dto: {type?: string; amount?: number; unit?: string; factorId?: string}) {
    return this.prisma.activity.update({where: {id}, data: dto});
  }

  async duplicate(id: string) {
    const a = await this.prisma.activity.findUnique({where: {id}});
    if (!a) throw new Error('Activity not found');
    const copy = await this.prisma.activity.create({
      data: {
        projectId: a.projectId,
        type: a.type,
        amount: a.amount,
        unit: a.unit,
        location: a.location || undefined,
        factorId: a.factorId || undefined,
        metadata: a.metadata as unknown as Prisma.InputJsonValue
      }
    });
    return copy;
  }

  async remove(id: string) {
    await this.prisma.calculation.deleteMany({ where: { activityId: id } });
    return this.prisma.activity.delete({ where: { id } });
  }
}
