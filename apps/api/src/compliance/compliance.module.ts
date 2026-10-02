import { Module } from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import { ComplianceController } from './compliance.controller';
import { StandardsModule } from '../standards/standards.module';
import { TestingModule } from '../testing/testing.module';
import { LaboratoriesModule } from '../laboratories/laboratories.module';
import { ProcurementModule } from '../procurement/procurement.module';

@Module({
  imports: [ProcurementModule, StandardsModule, TestingModule, LaboratoriesModule],
  controllers: [ComplianceController],
  providers: [ComplianceService],
  exports: [ComplianceService]
})
export class ComplianceModule {}
