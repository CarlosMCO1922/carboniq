import {Controller, Get, Post, Body, Param, Query, Res, Delete} from '@nestjs/common';
import type {Response} from 'express';
import {ProjectsService} from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projects: ProjectsService) {}

  @Get()
  list(@Query('organizationId') organizationId?: string) {
    return this.projects.list(organizationId);
  }

  @Post()
  create(
    @Body()
    dto: {organizationId: string; name: string; region: 'PT' | 'EU' | 'UK'; currency?: string; locale?: string}
  ) {
    return this.projects.create(dto);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.projects.get(id);
  }

  @Get(':id/summary')
  summary(
    @Param('id') id: string,
    @Query('from') from?: string,
    @Query('to') to?: string
  ) {
    return this.projects.summary(id, from, to);
  }

  @Get(':id/results')
  results(
    @Param('id') id: string,
    @Query('from') from?: string,
    @Query('to') to?: string
  ) {
    return this.projects.results(id, from, to);
  }

  @Get(':id/export.csv')
  async exportCsv(@Param('id') id: string, @Res() res: Response) {
    const {filename, content} = await this.projects.exportCsv(id);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(content);
  }

  @Get(':id/export.json')
  async exportJson(@Param('id') id: string) {
    return this.projects.exportJson(id);
  }

  @Post(':id/calculate')
  calculateAll(@Param('id') id: string) {
    return this.projects.calculateAll(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projects.remove(id);
  }

  @Post(':id/calculate-bulk')
  calculateBulk(@Param('id') id: string, @Body() body: {activityIds: string[]}) {
    return this.projects.calculateBulk(id, body.activityIds || []);
  }

  @Post(':id/compute-spend')
  computeSpend(@Param('id') id: string) {
    return this.projects.computeSpend(id);
  }
}
