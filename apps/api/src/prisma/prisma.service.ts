import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly client: any;

  readonly retroBoard: any;
  readonly retroSection: any;
  readonly retroItem: any;

  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });
    this.client = new PrismaClient({ adapter });
    this.retroBoard = this.client.retroBoard;
    this.retroSection = this.client.retroSection;
    this.retroItem = this.client.retroItem;
  }

  $transaction(...args: any[]) {
    return this.client.$transaction(...args);
  }

  async onModuleInit() {
    // connection managed by adapter
  }

  async onModuleDestroy() {
    await this.client.$disconnect?.();
  }
}
