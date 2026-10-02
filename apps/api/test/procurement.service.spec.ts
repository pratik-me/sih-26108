import { Test, TestingModule } from '@nestjs/testing';
import { ProcurementService } from '../src/procurement/procurement.service';
import { StandardsService } from '../src/standards/standards.service';
import { PrismaService } from '../src/common/prisma.service';

describe('ProcurementService (SIH 26108)', () => {
  let service: ProcurementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcurementService,
        StandardsService,
        {
          provide: PrismaService,
          useValue: {
            standard: { findMany: jest.fn().mockResolvedValue([]), findFirst: jest.fn().mockResolvedValue(null) },
            tenderAnalysis: { create: jest.fn(), findMany: jest.fn().mockResolvedValue([]) },
            supersededStandard: { findFirst: jest.fn().mockResolvedValue(null), findMany: jest.fn().mockResolvedValue([]) }
          }
        }
      ]
    }).compile();

    service = module.get<ProcurementService>(ProcurementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should detect GFR 144(i) brand bias in specifications', async () => {
    const result = await service.auditGFR144iCompliance({
      specificationText: 'Supply 100kW Solar Inverter. Preferred Make: ABB / Sungrow / SMA only.'
    });

    expect(result.isGfrCompliant).toBe(false);
    expect(result.violatingClauses.length).toBeGreaterThan(0);
    expect(result.violatingClauses[0].suggestedNeutralClause).toBeDefined();
  });

  it('should detect superseded standards and provide active replacement', async () => {
    const sup = await service.getSupersededStandardDetails('IS 4984:1995');
    expect(sup).toBeDefined();
    expect(sup?.activeStandard).toBe('IS 4984:2016');
  });

  it('should recommend applicable Indian Standards for potable water pipes', async () => {
    const recs = await service.recommendProcurementStandards({
      productName: 'HDPE Potable Water Pipes PE 100',
      rawText: 'HDPE pipes DN 110mm PN 16'
    });

    expect(recs.recommendations.length).toBeGreaterThan(0);
    expect(recs.recommendations[0].primaryStandard.standardNumber).toContain('IS 4984');
  });
});
