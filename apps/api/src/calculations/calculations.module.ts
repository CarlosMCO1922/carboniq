import {Module} from '@nestjs/common';
import {PrismaService} from '../prisma.service';
import {CalculationsService} from './calculations.service';
import {CalculationsController} from './calculations.controller';

@Module({
  controllers: [CalculationsController],
  providers: [CalculationsService, PrismaService]
})
export class CalculationsModule {}
