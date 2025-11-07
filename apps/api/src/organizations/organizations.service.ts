import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.organization.findMany({orderBy: {createdAt: 'desc'}});
  }

  create(dto: {name: string; type: 'B2C' | 'B2B'}) {
    return this.prisma.organization.create({data: dto});
  }

  get(id: string) {
    return this.prisma.organization.findUnique({where: {id}});
  }
}
