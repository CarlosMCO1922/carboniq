import {Body, Controller, Get, Post, Query, Req} from '@nestjs/common';
import type {Request} from 'express';
import {SpendService} from './spend.service';

@Controller('spend')
export class SpendController {
  constructor(private readonly spend: SpendService) {}

  @Get('mappings')
  listMappings(@Query('projectId') projectId: string) {
    return this.spend.listMappings(projectId);
  }

  @Post('mappings')
  upsertMapping(@Body() dto: {projectId: string; code: string; factorId: string; description?: string}) {
    return this.spend.upsertMapping(dto);
  }

  @Post('import.csv')
  async importCsv(
    @Query('projectId') projectId: string,
    @Req() req: Request
  ) {
    const raw = (req as any).rawBody?.toString('utf8') ?? '';
    return this.spend.importCsv(projectId, raw);
  }

  @Post('compute')
  compute(@Body() dto: {projectId: string}) {
    return this.spend.compute(dto.projectId);
  }
}
