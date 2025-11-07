import {Module} from '@nestjs/common';
import {PrismaService} from '../prisma.service';
import {OrganizationsService} from './organizations.service';
import {OrganizationsController} from './organizations.controller';

@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationsService, PrismaService],
  exports: [OrganizationsService]
})
export class OrganizationsModule {}
