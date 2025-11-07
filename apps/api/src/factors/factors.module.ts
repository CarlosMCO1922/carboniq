import {Module} from '@nestjs/common';
import {PrismaService} from '../prisma.service';
import {FactorsService} from './factors.service';
import {FactorsController} from './factors.controller';

@Module({
  controllers: [FactorsController],
  providers: [FactorsService, PrismaService]
})
export class FactorsModule {}
