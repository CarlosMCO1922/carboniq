import {Injectable} from '@nestjs/common';
import {PrismaService} from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({orderBy: {createdAt: 'desc'}});
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({where: {id}});
  }

  create(dto: {email: string; name?: string}) {
    return this.prisma.user.create({data: dto});
  }

  update(id: string, dto: {email?: string; name?: string}) {
    return this.prisma.user.update({where: {id}, data: dto});
  }

  remove(id: string) {
    return this.prisma.user.delete({where: {id}});
  }
}
