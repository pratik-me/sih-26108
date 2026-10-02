import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TestingService } from './testing.service';
import { type TestingSearchFilter } from '@bis/shared-types';

@ApiTags('Testing & Pre-Dispatch Inspection')
@Controller('testing')
export class TestingController {
  constructor(private testingService: TestingService) {}

  @Post('requirements')
  @ApiOperation({ summary: 'Get testing parameters, methods, and acceptance criteria by standard or product' })
  async getRequirements(@Body() filter: TestingSearchFilter) {
    return this.testingService.getTestingRequirements(filter);
  }

  @Get('pdi-schedule/:standardNumber')
  @ApiOperation({ summary: 'Get Pre-Dispatch Inspection (PDI) schedule and sampling criteria for procurement' })
  async getPDISchedule(@Param('standardNumber') standardNumber: string) {
    return this.testingService.getPDISchedule(decodeURIComponent(standardNumber));
  }

  @Get('pdi-schedules')
  @ApiOperation({ summary: 'List all available Pre-Dispatch Inspection (PDI) schedules' })
  async getAllPDISchedules() {
    return this.testingService.getAllPDISchedules();
  }
}
