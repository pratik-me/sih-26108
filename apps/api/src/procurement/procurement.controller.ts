import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProcurementService } from './procurement.service';
import { BOQItem } from '@bis/shared-types';

@ApiTags('Procurement & Tender Compliance')
@Controller('procurement')
export class ProcurementController {
  constructor(private procurementService: ProcurementService) {}

  @Post('analyze')
  @ApiOperation({ summary: 'Analyze raw tender text / BOQ lines, extract parameters and match Indian Standards' })
  async analyzeTender(@Body() body: { rawText: string; tenderTitle?: string }) {
    const parsed = await this.procurementService.parseTenderSpecifications(body.rawText, body.tenderTitle);
    const recs = await this.procurementService.recommendProcurementStandards({
      tenderTitle: body.tenderTitle,
      productName: parsed.boqItems[0]?.title || 'Procurement Goods',
      materialSpec: parsed.boqItems[0]?.materialSpecification,
      operatingConditions: parsed.boqItems[0]?.operatingConditions,
      rawText: body.rawText
    });
    const gfrAudit = await this.procurementService.auditGFR144iCompliance({
      tenderTitle: body.tenderTitle,
      specificationText: body.rawText,
      boqItems: parsed.boqItems
    });

    return {
      tenderTitle: body.tenderTitle || 'Tender Technical Specification Analysis',
      boqItems: parsed.boqItems,
      recommendations: recs.recommendations,
      gfrAudit,
      totalItemsExtracted: parsed.extractedCount
    };
  }

  @Post('recommend')
  @ApiOperation({ summary: 'Recommend Indian Standards & QCO statutory mandates for procurement specifications' })
  async recommendStandards(@Body() body: {
    tenderTitle?: string;
    productName: string;
    materialSpec?: string;
    operatingConditions?: string;
    rawText?: string;
  }) {
    return this.procurementService.recommendProcurementStandards(body);
  }

  @Post('gfr-audit')
  @ApiOperation({ summary: 'Audit tender specification for GFR Rule 144(i) bias & generate neutral clauses' })
  async auditGFR(@Body() body: { tenderTitle?: string; specificationText: string; boqItems?: BOQItem[] }) {
    return this.procurementService.auditGFR144iCompliance(body);
  }

  @Get('superseded/:standardNumber')
  @ApiOperation({ summary: 'Check if an Indian Standard is superseded / obsolete and get active replacement' })
  async getSupersededStandard(@Param('standardNumber') standardNumber: string) {
    return this.procurementService.getSupersededStandardDetails(decodeURIComponent(standardNumber));
  }

  @Get('superseded')
  @ApiOperation({ summary: 'List all superseded / obsolete Indian Standards mappings' })
  async getAllSuperseded() {
    return this.procurementService.getAllSupersededStandards();
  }

  @Get('sample-tenders')
  @ApiOperation({ summary: 'Get realistic sample tender specifications for one-click demo' })
  async getSampleTenders() {
    return this.procurementService.getSampleTenders();
  }
}
