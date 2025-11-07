import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { HealthController } from './health.controller';
import { OrganizationsModule } from './organizations/organizations.module';
import { ProjectsModule } from './projects/projects.module';
import { ActivitiesModule } from './activities/activities.module';
import { FactorsModule } from './factors/factors.module';
import { CalculationsModule } from './calculations/calculations.module';
import { SpendModule } from './spend/spend.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    OrganizationsModule,
    ProjectsModule,
    ActivitiesModule,
    FactorsModule,
    CalculationsModule,
    SpendModule
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
