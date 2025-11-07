import {Module} from '@nestjs/common';
import {PrismaService} from '../prisma.service';
import {ActivitiesService} from './activities.service';
import {ActivitiesController} from './activities.controller';

@Module({
  controllers: [ActivitiesController],
  providers: [ActivitiesService, PrismaService]
})
export class ActivitiesModule {}
