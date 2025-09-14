#!/usr/bin/env tsx
import dotenv from 'dotenv';
import { seedDatabase } from '../mastra/data/sampleCases';

dotenv.config();

async function main() {
  try {
    console.log('🚀 Starting database seeding script...');
    
    // Check required environment variables
    if (!process.env.COHERE_API_KEY) {
      throw new Error('COHERE_API_KEY is required for generating embeddings');
    }
    
    if (!process.env.TIDB_HOST || !process.env.TIDB_USER || !process.env.TIDB_PASSWORD) {
      throw new Error('TiDB configuration is required (TIDB_HOST, TIDB_USER, TIDB_PASSWORD)');
    }
    
    await seedDatabase();
    
    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    process.exit(1);
  }
}

main();
