import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { configurePrismaEngine } from './prisma-engine';

// Configure engine at module import time
configurePrismaEngine();

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    configurePrismaEngine();
    super();
  }

  async onModuleInit() {
    try {
      configurePrismaEngine();
      await this.$connect();
      console.log('Connected to PostgreSQL with pgvector');
    } catch (err: any) {
      console.warn('Prisma connection warning (using mock/offline store fallback):', err.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
