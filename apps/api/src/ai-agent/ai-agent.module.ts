import { Module } from '@nestjs/common';
import { AiAgentService } from './ai-agent.service';
import { StandardsModule } from '../standards/standards.module';
import { TestingModule } from '../testing/testing.module';
import { LaboratoriesModule } from '../laboratories/laboratories.module';
import { ProcurementModule } from '../procurement/procurement.module';
import { CertificationModule } from '../certification/certification.module';
import { RAGModule } from '../rag/rag.module';

@Module({
  imports: [
    StandardsModule,
    TestingModule,
    LaboratoriesModule,
    ProcurementModule,
    CertificationModule,
    RAGModule
  ],
  providers: [AiAgentService],
  exports: [AiAgentService]
})
export class AiAgentModule {}
