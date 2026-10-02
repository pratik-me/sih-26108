import { Module } from '@nestjs/common';
import { ProcurementController } from './procurement.controller';
import { ProcurementService } from './procurement.service';
import { StandardsModule } from '../standards/standards.module';
import { PrismaService } from '../common/prisma.service';

@Module({
  imports: [StandardsModule],
  controllers: [ProcurementController],
  providers: [ProcurementService, PrismaService],
  exports: [ProcurementService]
})
export class ProcurementModule {}
