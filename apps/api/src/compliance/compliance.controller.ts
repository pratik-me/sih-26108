import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ComplianceService } from './compliance.service';

@ApiTags('Procurement Compliance Dossiers')
@Controller('compliance')
export class ComplianceController {
  constructor(private complianceService: ComplianceService) {}

  @Post('generate-report')
  @ApiOperation({ summary: 'Generate comprehensive Procurement Compliance Dossier for GeM / CPPP tenders' })
  async generateReport(@Body() body: {
    tenderTitle: string;
    tenderNumber?: string;
    procuringEntity?: string;
    rawSpecificationText: string;
  }) {
    return this.complianceService.generateProcurementDossier(body);
  }
}