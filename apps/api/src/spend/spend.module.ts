import {Module} from '@nestjs/common';
import {PrismaService} from '../prisma.service';
import {SpendController} from './spend.controller';
import {SpendService} from './spend.service';

@Module({
  controllers: [SpendController],
  providers: [SpendService, PrismaService]
})
export class SpendModule {}
