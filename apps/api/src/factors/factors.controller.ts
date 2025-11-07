import {Controller, Get, Query} from '@nestjs/common';
import {FactorsService} from './factors.service';

@Controller('factors')
export class FactorsController {
  constructor(private readonly factors: FactorsService) {}

  @Get()
  list(@Query('region') region?: 'PT' | 'EU' | 'UK', @Query('scope') scope?: 'SCOPE1' | 'SCOPE2' | 'SCOPE3') {
    return this.factors.list({region, scope});
  }

  @Get('search')
  search(
    @Query('q') q?: string,
    @Query('region') region?: 'PT' | 'EU' | 'UK',
    @Query('scope') scope?: 'SCOPE1' | 'SCOPE2' | 'SCOPE3',
    @Query('unit') unit?: string,
    @Query('version') version?: string,
    @Query('limit') limit?: string,
  ) {
    const take = limit ? Number(limit) : undefined;
    return this.factors.search({q, region, scope, unit, version, limit: take});
  }

  @Get('suggest')
  suggest(@Query('region') region: 'PT' | 'EU' | 'UK', @Query('type') type: string) {
    return this.factors.suggest({region, type});
  }
}
