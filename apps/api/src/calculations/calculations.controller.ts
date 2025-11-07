import {Controller, Post, Body} from '@nestjs/common';
import {CalculationsService} from './calculations.service';

@Controller('calculations')
export class CalculationsController {
  constructor(private readonly calc: CalculationsService) {}

  @Post()
  async compute(@Body() dto: {activityId: string; method?: string; factorId?: string}) {
    return this.calc.compute(dto);
  }
}
