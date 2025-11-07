import {Controller, Get, Post, Body, Param, Query, Patch, Delete} from '@nestjs/common';
import {ActivitiesService} from './activities.service';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activities: ActivitiesService) {}

  @Get()
  list(@Query('projectId') projectId?: string) {
    return this.activities.list(projectId);
  }

  @Post()
  create(
    @Body()
    dto: {
      projectId: string;
      type: string;
      amount: number;
      unit: string;
      location?: string;
      periodFrom?: string;
      periodTo?: string;
      factorId?: string;
      metadata?: Record<string, unknown>;
    }
  ) {
    return this.activities.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: {type?: string; amount?: number; unit?: string; factorId?: string}) {
    return this.activities.update(id, dto);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.activities.get(id);
  }

  @Post(':id/duplicate')
  duplicate(@Param('id') id: string) {
    return this.activities.duplicate(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activities.remove(id);
  }
}
