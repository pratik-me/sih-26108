import { TestingService } from '../src/testing/testing.service';
import { PrismaService } from '../src/common/prisma.service';

describe('TestingService (PDI & Procurement Testing)', () => {
  let service: TestingService;

  beforeEach(() => {
    service = new TestingService({} as PrismaService);
  });

  it('should return Pre-Dispatch Inspection (PDI) schedule for IS 4984', async () => {
    const schedule = await service.getPDISchedule('IS 4984:2016');
    expect(schedule).toBeDefined();
    expect(schedule.samplingStandard).toContain('IS 2500');
    expect(schedule.testItems.length).toBeGreaterThan(0);
  });

  it('should return testing requirements for TMT steel bars under IS 1786', async () => {
    const reqs = await service.getTestingRequirements({ standardNumber: 'IS 1786:2008' });
    expect(reqs.length).toBeGreaterThan(0);
    expect(reqs.some(r => r.testName.includes('Tensile') || r.testName.includes('Proof Stress'))).toBe(true);
  });
});
