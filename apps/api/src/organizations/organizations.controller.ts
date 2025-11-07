import {Controller, Get, Post, Body, Param} from '@nestjs/common';
import {OrganizationsService} from './organizations.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly orgs: OrganizationsService) {}

  @Get()
  list() {
    return this.orgs.list();
  }

  @Post()
  create(@Body() dto: {name: string; type: 'B2C' | 'B2B'}) {
    return this.orgs.create(dto);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.orgs.get(id);
  }
}
